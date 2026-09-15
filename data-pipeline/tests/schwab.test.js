'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parse, sourceUrl } = require('../adapters/schwab');

test('Schwab adapter parses the all-holdings HTML table', () => {
  const html = `
    <section class="view__header--as-of-date">As of 09/11/26</section>
    <table><tbody>
      <tr><td data-label="Fund Name">MERCK &amp; CO INC</td><td data-label="CUSIP">58933Y105</td><td data-label="Symbol">MRK</td><td data-label="% of Assets">75.00%</td></tr>
      <tr><td data-label="Fund Name">Cash &amp; equivalents</td><td data-label="CUSIP"></td><td data-label="Symbol"></td><td data-label="% of Assets">25.00%</td></tr>
    </tbody></table>`;
  const fund = { symbol: 'SCHD', ticker: 'SCHD', country: 'US', currency: 'USD' };
  const result = parse(html, fund, { retrievedAt: '2026-09-14T00:00:00Z' });
  assert.equal(result.holdingsDate, '2026-09-11');
  assert.equal(result.holdings[0].name, 'MERCK & CO INC');
  assert.deepEqual(result.holdings.map(row => row.type), ['stock', 'cash']);
  assert.equal(result.reportedCoverage, 100);
  assert.match(sourceUrl(fund), /allholdings\/SCHD$/);
});

test('Schwab adapter rejects pages without the holdings table', () => {
  assert.throws(() => parse('<html></html>', { symbol: 'TEST', ticker: 'TEST' }), /holdings table was not found/);
});
