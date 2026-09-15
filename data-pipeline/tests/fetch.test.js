'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { fetchText, retryableStatus } = require('../lib/fetch');

test('retryable HTTP statuses are explicit', () => {
  assert.equal(retryableStatus(429), true);
  assert.equal(retryableStatus(503), true);
  assert.equal(retryableStatus(404), false);
});

test('shared downloader retries transient failures', async t => {
  const originalFetch = global.fetch;
  let attempts = 0;
  global.fetch = async () => {
    attempts += 1;
    if (attempts < 3) throw new Error('temporary network failure');
    return { ok: true, text: async () => 'holdings' };
  };
  t.after(() => { global.fetch = originalFetch; });

  const body = await fetchText('https://issuer.example/holdings', { attempts: 3, retryDelayMs: 1 });
  assert.equal(body, 'holdings');
  assert.equal(attempts, 3);
});

test('shared downloader does not retry permanent HTTP errors', async t => {
  const originalFetch = global.fetch;
  let attempts = 0;
  global.fetch = async () => {
    attempts += 1;
    return { ok: false, status: 404 };
  };
  t.after(() => { global.fetch = originalFetch; });

  await assert.rejects(fetchText('https://issuer.example/missing', { attempts: 3, retryDelayMs: 1 }), /HTTP 404/);
  assert.equal(attempts, 1);
});
