'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { securityId } = require('../lib/identity');

test('exchange-qualified tickers keep unrelated companies separate', () => {
  assert.notEqual(
    securityId({ ticker: 'T', exchange: 'NYSE' }),
    securityId({ ticker: 'T', exchange: 'TSX' })
  );
});

test('ISIN takes precedence over ticker and exchange', () => {
  assert.equal(securityId({ isin: 'CA 87971M1032', ticker: 'T', exchange: 'TSX' }), 'ISIN:CA87971M1032');
});

test('ETF references use a distinct identity namespace', () => {
  assert.equal(securityId({ type: 'etf', ticker: 'XIC.TO' }), 'ETF:XIC.TO');
});

test('bonds without tickers use their issuer identifier', () => {
  assert.equal(securityId({ type: 'bond', isin: 'US91282ABC12', name: 'Treasury Note' }), 'ISIN:US91282ABC12');
});

test('issuer source IDs identify holdings without standard identifiers', () => {
  const first = securityId({
    type: 'bond', name: 'Province of Ontario', sourceId: 'VANGUARD-CA|FI.CORP|ONT|2035-06-02|4.15'
  });
  const second = securityId({
    type: 'bond', name: 'Province of Ontario', sourceId: 'VANGUARD-CA|FI.CORP|ONT|2036-06-02|4.15'
  });
  assert.equal(first, 'SOURCE:VANGUARDCAFICORPONT20350602415');
  assert.notEqual(first, second);
});
