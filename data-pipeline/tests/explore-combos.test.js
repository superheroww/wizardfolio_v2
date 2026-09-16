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

function loadStartupData() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(repositoryRoot, 'mock-data.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(path.join(repositoryRoot, 'etf-catalog.js'), 'utf8'), context);
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
  const { comboDefinitions, initialPortfolio, popularCombos, presets } = loadWizardFolioData();
  const featured = comboDefinitions.filter(combo => combo.featured);

  assert.equal(featured.length, 3);
  assert.equal(popularCombos.length, 3);
  assert.deepEqual(Array.from(initialPortfolio.tickers), ['VOO', 'XEQT']);
  assert.deepEqual(Array.from(initialPortfolio.weights), [60, 40]);
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

test('Explorer cards show verified previews and never present unavailable analysis', () => {
  const { comboDefinitions } = loadWizardFolioData();
  const appSource = fs.readFileSync(path.join(repositoryRoot, 'app.js'), 'utf8');
  const explorerSource = appSource.slice(
    appSource.indexOf('function explorePreview('),
    appSource.indexOf('function exploreTagsForCombo(')
  );

  comboDefinitions.forEach(combo => assert.ok(combo.note, `${combo.id} is missing its explanation`));
  assert.match(explorerSource, /pipelineLoaded/);
  assert.match(explorerSource, /snapshot\.holdings\.length/);
  assert.match(explorerSource, /explore-card-body-loading/);
  assert.match(explorerSource, /explore-preview-metrics/);
  assert.match(explorerSource, /exploreMetricIcons/);
  assert.doesNotMatch(explorerSource, /▥|◎|◇/);
  assert.doesNotMatch(explorerSource, /uniqueEstimate/);
  assert.doesNotMatch(appSource, /No overlap data|Underlying company holdings are not available for this mix/);
});

test('startup portfolio is available before asynchronous catalog hydration', () => {
  const { etfs, initialPortfolio } = loadStartupData();
  const appSource = fs.readFileSync(path.join(repositoryRoot, 'app.js'), 'utf8');

  initialPortfolio.tickers.forEach(ticker => {
    assert.ok(etfs[ticker], `${ticker} is unavailable during synchronous startup`);
  });
  assert.equal(initialPortfolio.tickers.length, initialPortfolio.weights.length);
  assert.equal(initialPortfolio.weights.reduce((sum, weight) => sum + weight, 0), 100);
  assert.doesNotMatch(appSource, /presetData\.core/);
});
