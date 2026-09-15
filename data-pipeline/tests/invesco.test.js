'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parse, sourceUrl } = require('../adapters/invesco');

test('Invesco adapter normalizes the official holdings response', () => {
  const payload = {
    effectiveBusinessDate: '2026-09-11',
    holdings: [
      { ticker: 'NVDA', issuerName: 'NVIDIA Corp', percentageOfTotalNetAssets: 60, marketValueBase: 600, currency: 'USD', securityTypeName: 'Common Stock', cusip: '67066G104' },
      { ticker: null, issuerName: 'Cash', percentageOfTotalNetAssets: 40, marketValueBase: 400, currency: 'USD', securityTypeName: 'Cash' }
    ]
  };
  const fund = { symbol: 'QQQM', ticker: 'QQQM', currency: 'USD', cusip: '46138G649' };
  const result = parse(JSON.stringify(payload), fund, { retrievedAt: '2026-09-14T00:00:00Z' });
  assert.equal(result.holdingsDate, '2026-09-11');
  assert.deepEqual(result.holdings.map(row => row.type), ['stock', 'cash']);
  assert.equal(result.reportedCoverage, 100);
  assert.match(sourceUrl(fund), /46138G649/);
});

test('Invesco adapter requires holdings and a configured CUSIP', () => {
  assert.throws(() => parse('{}', { symbol: 'TEST' }), /holdings were not found/);
  assert.throws(() => sourceUrl({ symbol: 'TEST' }), /missing the Invesco CUSIP/);
});
