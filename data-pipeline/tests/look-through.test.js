'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { aggregatePortfolio, flattenFund } = require('../lib/look-through');

const funds = [
  {
    id: 'CA:TSX:PARENT', symbol: 'PARENT.TO', holdings: [
      { type: 'etf', ticker: 'CHILD', weight: 40 },
      { type: 'stock', ticker: 'ROOT', exchange: 'TSX', name: 'Root', weight: 60 }
    ]
  },
  {
    id: 'CA:TSX:CHILD', symbol: 'CHILD.TO', holdings: [
      { type: 'stock', ticker: 'ACME', exchange: 'TSX', name: 'Acme', weight: 50 },
      { type: 'stock', ticker: 'OTHER', exchange: 'TSX', name: 'Other', weight: 50 }
    ]
  },
  {
    id: 'US:NYSE:DIRECT', symbol: 'DIRECT', holdings: [
      { type: 'stock', ticker: 'ACME', exchange: 'TSX', name: 'Acme', weight: 20 }
    ]
  },
  { id: 'CYCLE:A', symbol: 'CYCLEA', holdings: [{ type: 'etf', ticker: 'CYCLEB', weight: 100 }] },
  { id: 'CYCLE:B', symbol: 'CYCLEB', holdings: [{ type: 'etf', ticker: 'CYCLEA', weight: 100 }] }
];

test('nested ETF exposure multiplies every level and resolves .TO aliases', () => {
  const acme = flattenFund('PARENT.TO', funds).find(row => row.ticker === 'ACME');
  assert.equal(acme.exposure * 100, 20);
  assert.deepEqual(acme.path, ['PARENT.TO', 'CHILD.TO', 'ACME']);
});

test('duplicate exposure aggregates across portfolio paths', () => {
  const result = aggregatePortfolio([
    { symbol: 'PARENT.TO', weight: 50 },
    { symbol: 'DIRECT', weight: 50 }
  ], funds);
  assert.equal(result.find(row => row.ticker === 'ACME').weight, 20);
});

test('circular ETF references terminate', () => {
  assert.deepEqual(flattenFund('CYCLEA', funds), []);
});
