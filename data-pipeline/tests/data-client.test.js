'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { createClient, displayTicker, frontendFund } = require('../../data-client');

test('Canadian symbols use their display ticker in the UI', () => {
  assert.equal(displayTicker({ symbol: 'XEQT.TO' }), 'XEQT');
  assert.equal(displayTicker({ ticker: 'VOO' }), 'VOO');
});

test('published holdings replace a static fallback without losing UI detail', () => {
  const result = frontendFund({
    symbol: 'VDY.TO', ticker: 'VDY', name: 'Vanguard Canadian Dividend ETF', country: 'CA',
    holdingsDate: '2026-09-14', sourceUrl: 'https://example.test/vdy',
    holdings: [{ type: 'stock', ticker: 'RY', name: 'Royal Bank', weight: 15 }]
  }, { detail: '🍁 Canadian dividend', holdings: { RY: ['Old Royal Bank', '🍁', 10] } });

  assert.equal(result.detail, '🍁 Canadian dividend');
  assert.equal(result.holdings[0].weight, 15);
  assert.equal(result.pipelineLoaded, true);
});

test('catalog populates Add ETF entries and holdings load lazily with child ETFs', async () => {
  const store = {};
  const requests = [];
  const responses = {
    './public/data/catalog.json': { funds: [
      { symbol: 'PARENT.TO', ticker: 'PARENT', name: 'Parent', country: 'CA' },
      { symbol: 'CHILD', ticker: 'CHILD', name: 'Child', country: 'US' }
    ] },
    './public/data/funds/PARENT.TO.json': { symbol: 'PARENT.TO', ticker: 'PARENT', holdings: [{ type: 'etf', ticker: 'CHILD', name: 'Child', weight: 100 }] },
    './public/data/funds/CHILD.json': { symbol: 'CHILD', ticker: 'CHILD', holdings: [{ type: 'stock', ticker: 'ACME', name: 'Acme', weight: 100 }] }
  };
  const fetchImpl = async url => {
    requests.push(url);
    return { ok: Boolean(responses[url]), status: responses[url] ? 200 : 404, json: async () => responses[url] };
  };
  const client = createClient({ store, fetchImpl });

  await client.loadCatalog();
  assert.deepEqual(Object.keys(store).sort(), ['CHILD', 'PARENT']);
  assert.equal(requests.length, 1);
  await client.loadFund('PARENT');
  assert.equal(store.PARENT.pipelineLoaded, true);
  assert.equal(store.CHILD.pipelineLoaded, true);
  assert.equal(requests.length, 3);
});
