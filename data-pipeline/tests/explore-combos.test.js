'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const repositoryRoot = path.resolve(__dirname, '..', '..');

function loadWizardFolioData() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(repositoryRoot, 'mock-data.js'), 'utf8'), context);
  return context.window.WIZARD_FOLIO_DATA;
}

test('Explorer publishes ten valid, distinct combinations', () => {
  const { comboDefinitions } = loadWizardFolioData();
  const ids = new Set();

  assert.equal(comboDefinitions.length, 10);
  comboDefinitions.forEach(combo => {
    assert.ok(combo.id);
    assert.equal(ids.has(combo.id), false, `duplicate combination id: ${combo.id}`);
    ids.add(combo.id);
    assert.equal(combo.preset, combo.id);
    assert.equal(combo.tickers.length, combo.weights.length);
    assert.ok(combo.tickers.length >= 2);
    assert.equal(combo.weights.reduce((sum, weight) => sum + weight, 0), 100);
    assert.ok(combo.tags.length > 0);
    assert.equal(combo.action, undefined);
  });
});

test('every Explorer ticker resolves to an enabled published fund', () => {
  const { comboDefinitions } = loadWizardFolioData();
  const config = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'data-pipeline', 'config', 'funds.json'), 'utf8'));
  const enabled = new Set(config.funds.filter(fund => fund.enabled).map(fund => fund.symbol.replace(/\.TO$/i, '')));

  comboDefinitions.flatMap(combo => combo.tickers).forEach(ticker => {
    assert.ok(enabled.has(ticker), `${ticker} is not enabled in the fund registry`);
  });
});

test('Home stays focused on exactly three featured combinations', () => {
  const { comboDefinitions, popularCombos, presets } = loadWizardFolioData();
  const featured = comboDefinitions.filter(combo => combo.featured);

  assert.equal(featured.length, 3);
  assert.equal(popularCombos.length, 3);
  assert.deepEqual(
    [...Object.keys(presets)].sort(),
    [...comboDefinitions.map(combo => combo.preset)].sort()
  );
});

test('Explorer categories are explicit and backed by filter controls', () => {
  const { comboDefinitions } = loadWizardFolioData();
  const html = fs.readFileSync(path.join(repositoryRoot, 'index.html'), 'utf8');
  const filters = new Set([...html.matchAll(/data-explore-filter="([^"]+)"/g)].map(match => match[1]));

  assert.deepEqual([...filters].sort(), ['all', 'canada', 'global', 'growth', 'income', 'us']);
  comboDefinitions.flatMap(combo => combo.tags).forEach(tag => {
    assert.ok(filters.has(tag), `missing Explorer filter for ${tag}`);
  });
});
