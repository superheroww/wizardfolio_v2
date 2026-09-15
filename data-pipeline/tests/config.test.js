'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const config = require('../config/funds.json');

function aliases(symbol) {
  const normalized = String(symbol || '').toUpperCase();
  return normalized.endsWith('.TO') ? [normalized, normalized.slice(0, -3)] : [normalized, `${normalized}.TO`];
}

test('enabled fund symbols and IDs are unique', () => {
  const enabled = config.funds.filter(fund => fund.enabled);
  assert.equal(new Set(enabled.map(fund => fund.symbol)).size, enabled.length);
  assert.equal(new Set(enabled.map(fund => fund.id)).size, enabled.length);
});

test('every configured child ETF resolves to an enabled fund', () => {
  const enabled = config.funds.filter(fund => fund.enabled);
  const symbols = new Set(enabled.flatMap(fund => aliases(fund.symbol)));
  const missing = enabled.flatMap(fund => (fund.childSymbols || [])
    .filter(child => !aliases(child).some(alias => symbols.has(alias)))
    .map(child => `${fund.symbol} -> ${child}`));
  assert.deepEqual(missing, []);
});
