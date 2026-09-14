'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parse, sourceUrl } = require('../adapters/vanguard');

test('Vanguard adapter normalizes all holding groups', () => {
  const payload = {
    profile: { fundFullName: 'Vanguard Test ETF' },
    holdingDetails: {
      asOfDate: '08/31/2026',
      equityHoldings: [{ securityLongDescription: 'Apple', ticker: 'AAPL', isin: 'US0378331005', marketValuePercentage: '70.00%', marketValueBaseCurrency: '$700' }],
      fixedIncomeHoldings: [{ securityLongDescription: 'Treasury', cusip: 'AAA', marketValuePercentage: '20.00%', marketValueBaseCurrency: '$200' }],
      shortTermReservesHoldings: [{ securityLongDescription: 'Cash', securityId: 'CASH', marketValuePercentage: '10.00%', marketValueBaseCurrency: '$100' }]
    }
  };
  const fund = { ticker: 'TEST', symbol: 'TEST', currency: 'USD' };
  const result = parse(payload, fund, { retrievedAt: '2026-09-14T00:00:00Z' });
  assert.equal(result.holdingsDate, '2026-08-31');
  assert.deepEqual(result.holdings.map(row => row.type), ['stock', 'bond', 'cash']);
  assert.equal(result.reportedCoverage, 100);
  assert.match(sourceUrl(fund), /TEST-AdditionalFundData$/);
});

test('Vanguard adapter normalizes rounded portfolios from complete market values', () => {
  const payload = { holdingDetails: {
    asOfDate: '08/31/2026',
    equityHoldings: [
      { securityLongDescription: 'Large', isin: 'USLARGE', marketValuePercentage: '90.00%', marketValueBaseCurrency: '$900' },
      { securityLongDescription: 'Rounded small', isin: 'USSMALL', marketValuePercentage: '0.00%', marketValueBaseCurrency: '$100' }
    ]
  } };
  const result = parse(payload, { ticker: 'TEST', symbol: 'TEST', currency: 'USD' });
  assert.equal(result.reportedCoverage, 90);
  assert.equal(result.weightMethod, 'market-value-normalized');
  assert.equal(result.holdings.reduce((sum, holding) => sum + holding.weight, 0), 100);
});
