'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repositoryRoot = path.resolve(__dirname, '..', '..');

test('mobile navigation exposes only Explore, Blend, and Compare', () => {
  const html = fs.readFileSync(path.join(repositoryRoot, 'index.html'), 'utf8');
  const nav = html.match(/<nav aria-label="Primary navigation">([\s\S]*?)<\/nav>/)?.[1] || '';
  const targets = [...nav.matchAll(/data-nav-target="([^"]+)"/g)].map(match => match[1]);

  assert.deepEqual(targets, ['explore', 'blend', 'compare']);
  assert.equal((nav.match(/<button/g) || []).length, 3);
  assert.doesNotMatch(nav, />Home</);
  assert.doesNotMatch(nav, /nav-active/);
  assert.match(html, /class="home-brand"><a href="\/" data-home-link>Wizardfolio<\/a>/);
  assert.match(html, /viewport-fit=cover/);
});

test('mobile navigation is safe-area aware and has no selected pill', () => {
  const css = fs.readFileSync(path.join(repositoryRoot, 'refinement.css'), 'utf8');
  const appSource = fs.readFileSync(path.join(repositoryRoot, 'app.js'), 'utf8');
  const navCss = css.slice(css.indexOf('/* Lightweight iOS-style tab bar. */'), css.indexOf('/* Explore feed'));

  assert.match(navCss, /height:\s*calc\(62px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(navCss, /padding-bottom:\s*calc\(82px \+ env\(safe-area-inset-bottom\)\)/);
  assert.match(navCss, /bottom:\s*0/);
  assert.match(navCss, /nav button\.nav-active[\s\S]*background:\s*transparent/);
  assert.match(appSource, /data-nav-target/);
  assert.match(appSource, /showScreen\('builder', 'compare'\)/);
  assert.match(appSource, /showScreen\('home', null\)/);
});
