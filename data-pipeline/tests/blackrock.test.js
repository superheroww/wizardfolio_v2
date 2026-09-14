'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parse, sourceUrl } = require('../adapters/blackrock');

test('BlackRock adapter finds headers after issuer metadata rows', () => {
  const csv = [
    'Fund Holdings as of,Sep 13 2026',
    'Ticker,Name,Asset Class,Weight (%),Sector,Location,Exchange,Currency,ISIN',
    'T,TELUS CORP,Equity,99.2,Communication Services,Canada,TSX,CAD,CA87971M1032'
  ].join('\n');
  const fund = { symbol: 'TEST.TO', productId: '1', fileName: 'TEST_holdings' };
  const result = parse(csv, fund, { retrievedAt: '2026-09-14T00:00:00Z' });
  assert.equal(result.holdings.length, 1);
  assert.equal(result.holdingsDate, '2026-09-13');
  assert.equal(result.holdings[0].isin, 'CA87971M1032');
  assert.match(sourceUrl(fund), /TEST_holdings/);
});

test('BlackRock adapter supports bonds without tickers and retains negative positions', () => {
  const csv = [
    'iShares Bond ETF',
    'Fund Holdings as of,"Sep 10, 2026"',
    '',
    'Name,Sector,Asset Class,Weight (%),CUSIP,ISIN,SEDOL,Location,Exchange,Currency,Market Currency',
    'TREASURY NOTE,Treasury,Fixed Income,100.5,91282ABC1,US91282ABC12,ABC1234,United States,-,USD,USD',
    'USD CASH,Cash and/or Derivatives,Cash,-0.5,,,,United States,-,USD,USD'
  ].join('\n');
  const fund = { symbol: 'BOND', productId: '1', fileName: 'BOND_holdings' };
  const result = parse(csv, fund, { retrievedAt: '2026-09-14T00:00:00Z' });
  assert.equal(result.holdings.length, 2);
  assert.equal(result.holdings[0].ticker, null);
  assert.equal(result.holdings[0].type, 'bond');
  assert.equal(result.holdings[1].weight, -0.5);
});

test('BlackRock adapter normalizes rounded bond weights from market values', () => {
  const csv = [
    'iShares Bond ETF',
    'Fund Holdings as of,"Sep 10, 2026"',
    '',
    'Name,Sector,Asset Class,Market Value,Weight (%),CUSIP,ISIN,Location,Exchange,Currency,Market Currency',
    'BOND A,Treasury,Fixed Income,80,80,AAA,USAAA,United States,-,USD,USD',
    'SMALL BOND,Treasury,Fixed Income,20,0,AAB,USAAB,United States,-,USD,USD'
  ].join('\n');
  const result = parse(csv, { symbol: 'BOND', productId: '1', fileName: 'BOND_holdings' });
  assert.equal(result.weightMethod, 'market-value-normalized');
  assert.equal(result.holdings.reduce((sum, holding) => sum + holding.weight, 0), 100);
});
