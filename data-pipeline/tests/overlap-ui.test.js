'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..', '..');

test('overlap results use the light card hierarchy without changing metrics', () => {
  const appSource = fs.readFileSync(path.join(repositoryRoot, 'app.js'), 'utf8');
  const html = fs.readFileSync(path.join(repositoryRoot, 'index.html'), 'utf8');
  const overlapSource = appSource.slice(
    appSource.indexOf('function overlapFundRowMarkup('),
    appSource.indexOf('const maxSector =', appSource.indexOf('function renderPortfolio('))
  );

  assert.match(overlapSource, /overlap-card/);
  assert.match(overlapSource, /overlap-hero/);
  assert.match(overlapSource, /overlap-progress/);
  assert.match(overlapSource, /overlap-insight/);
  assert.match(overlapSource, /overlapPair\.totalOverlap/);
  assert.match(overlapSource, /overlapPair\.sharedCount/);
  assert.match(overlapSource, /overlapPair\.shareOfHoldingsA/);
  assert.match(overlapSource, /overlapPair\.shareOfHoldingsB/);
  assert.doesNotMatch(appSource, /overlap-dashboard|overlap-stats/);
  assert.doesNotMatch(html, /overlap-dashboard|overlap-stats/);
});

test('overlap card styling stays light, compact, and consistent', () => {
  const css = fs.readFileSync(path.join(repositoryRoot, 'refinement.css'), 'utf8');
  const overlapCss = css.slice(css.indexOf('.overlap-card {'), css.indexOf('.sector-bars {'));

  assert.match(overlapCss, /background:#fff/);
  assert.match(overlapCss, /border:1px solid #e0e5ed/);
  assert.match(overlapCss, /\.overlap-hero strong \{ color:var\(--blue\)/);
  assert.match(overlapCss, /\.overlap-progress \{ height:6px/);
  assert.doesNotMatch(overlapCss, /gradient|#10182c|#18223a|#285ccf/);
});
