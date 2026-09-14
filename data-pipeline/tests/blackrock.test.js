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
