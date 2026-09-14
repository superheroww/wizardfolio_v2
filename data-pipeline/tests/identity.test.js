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
