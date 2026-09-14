'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { qualityFor, validateFund } = require('../lib/validate');

test('quality thresholds are explicit', () => {
  assert.equal(qualityFor(99), 'complete');
  assert.equal(qualityFor(97), 'near-complete');
  assert.equal(qualityFor(40), 'partial');
  assert.equal(qualityFor(0), 'unavailable');
});

test('partial data cannot be published', () => {
  const result = validateFund({
    symbol: 'SAMPLE', sourceUrl: 'https://example.test', retrievedAt: '2026-09-14T00:00:00Z', holdingsDate: '2026-09-13',
    holdings: [{ type: 'stock', ticker: 'A', exchange: 'NYSE', name: 'A', weight: 40 }]
  }, { now: new Date('2026-09-14T00:00:00Z') });
  assert.equal(result.quality, 'partial');
  assert.equal(result.publishable, false);
});

test('stale issuer data cannot be published', () => {
  const result = validateFund({
    symbol: 'STALE', sourceUrl: 'https://example.test', retrievedAt: '2026-09-14T00:00:00Z', holdingsDate: '2026-08-01',
    holdings: [{ type: 'stock', ticker: 'A', exchange: 'NYSE', name: 'A', weight: 100 }]
  }, { now: new Date('2026-09-14T00:00:00Z'), maxDataAgeDays: 10 });
  assert.equal(result.quality, 'stale');
  assert.equal(result.publishable, false);
});
