'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..', '..');
const html = fs.readFileSync(path.join(repositoryRoot, 'index.html'), 'utf8');
const appSource = fs.readFileSync(path.join(repositoryRoot, 'app.js'), 'utf8');

test('homepage follows the connected builder, insights, and combinations journey', () => {
  const home = html.match(/<section id="home"[\s\S]*?<section id="explore"/)?.[0] || '';

  assert.match(home, /home-mix-card/);
  assert.match(home, /See beyond the ticker/);
  assert.match(home, /Popular combinations/);
  assert.doesNotMatch(home, /Hidden overlaps/);
  assert.doesNotMatch(home, /class="avatar"/);
  assert.doesNotMatch(home, /homeAppleWeight|homeUsWeight|12\.9%|55\.4%/);
});

test('homepage previews reuse live portfolio calculations instead of fixed metrics', () => {
  const start = appSource.indexOf('function updateHomeInsights()');
  const end = appSource.indexOf('function renderPopularCombos()', start);
  const source = appSource.slice(start, end);

  assert.match(source, /buildMixSnapshot\(state\.tickers, state\.weights\)/);
  assert.match(source, /strongestPortfolioOverlap\(state\.tickers, state\.weights\)/);
  assert.match(source, /new Set\(company\.sources/);
  assert.match(source, /snapshot\.geography\[0\]/);
  assert.doesNotMatch(source, /AAPL|Apple|United States|12\.9|55\.4/);
  assert.match(appSource, /function updateHomeMix\(\)[\s\S]*state\.tickers\.map/);
  assert.match(appSource, /function syncBuilderUi\(\)[\s\S]*updateHomeMix\(\);[\s\S]*updateHomeInsights\(\);/);
});

test('homepage removes only the standalone overlap presentation', () => {
  assert.doesNotMatch(appSource, /renderPopularCombos\(\);\s*renderHomeOverlaps\(\);/);
  assert.match(appSource, /function strongestPortfolioOverlap/);
  assert.match(appSource, /function renderHomeOverlaps/);
});
