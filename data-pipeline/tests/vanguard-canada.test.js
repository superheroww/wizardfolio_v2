'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const adapter = require('../adapters/vanguard-canada');

const fund = {
  id: 'CA:TSX:TEST', ticker: 'TEST', symbol: 'TEST.TO', country: 'CA', exchange: 'TSX',
  currency: 'CAD', issuer: 'vanguard-ca', portId: '1234'
};

function page(items, lastItemKey = null) {
  return {
    data: {
      funds: [{ profile: { fundFullName: 'Test Vanguard ETF', fundCurrency: 'CAD' } }],
      borHoldings: [{ holdings: { items, totalHoldings: items.length, lastItemKey } }]
    }
  };
}

test('Vanguard Canada maps ETF, stock, bond, and cash holdings', () => {
  const payload = { pages: [page([
    { ticker: 'VTI', securityLongDescription: 'Vanguard Total Stock Market ETF', securityType: 'EQ.ETF', marketValuePercentage: 40, marketValueBaseCurrency: 400, effectiveDate: '2026-09-12' },
    { ticker: 'RY', securityLongDescription: 'Royal Bank', securityType: 'EQ.STOCK', marketValuePercentage: 30, marketValueBaseCurrency: 300, gicsSectorDescription: 'Financials', bloombergIsoCountry: 'CA', effectiveDate: '2026-09-12' },
    { ticker: null, securityLongDescription: 'Canada Government Bond', securityType: 'FI.NONUS_GOV', marketValuePercentage: 20, marketValueBaseCurrency: 200, effectiveDate: '2026-09-12', finalMaturity: '2035-06-02', couponRate: 4.15 },
    { ticker: 'CAD', securityLongDescription: 'Canadian Dollar', securityType: 'MM.TD', marketValuePercentage: 10, marketValueBaseCurrency: 100, effectiveDate: '2026-09-12' }
  ])] };
  const result = adapter.parse(payload, fund, { sourceChecksum: 'fixture' });

  assert.equal(result.name, 'Test Vanguard ETF');
  assert.equal(result.holdingsDate, '2026-09-12');
  assert.deepEqual(result.holdings.map(row => row.type), ['etf', 'stock', 'bond', 'cash']);
  assert.match(result.holdings[2].sourceId, /^VANGUARD-CA\|FI\.NONUS_GOV/);
  assert.equal(result.maxDataAgeDays, 45);
  assert.equal(result.reportedCoverage, 100);
});

test('Vanguard Canada downloader follows pagination tokens', async () => {
  const requests = [];
  const responses = [page([{ ticker: 'ONE' }], 'next-page'), page([{ ticker: 'TWO' }])];
  const payload = await adapter.fetchPayload(fund, {
    fetchText: async (url, options) => {
      requests.push({ url, options });
      return JSON.stringify(responses[requests.length - 1]);
    }
  });
  const document = JSON.parse(payload);

  assert.equal(document.pages.length, 2);
  assert.equal(requests[0].url, adapter.endpoint);
  assert.equal(requests[0].options.method, 'POST');
  assert.equal(JSON.parse(requests[0].options.body).variables.lastItemKey, null);
  assert.equal(JSON.parse(requests[1].options.body).variables.lastItemKey, 'next-page');
});

test('Vanguard Canada rejects GraphQL errors and missing identifiers', async () => {
  assert.throws(() => adapter.sourceUrl({ symbol: 'NOPE.TO' }), /portId/);
  await assert.rejects(
    adapter.fetchPayload(fund, { fetchText: async () => JSON.stringify({ errors: [{ message: 'Unavailable' }] }) }),
    /GraphQL error: Unavailable/
  );
});
