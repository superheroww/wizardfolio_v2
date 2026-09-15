#!/usr/bin/env node
'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const blackrock = require('./adapters/blackrock');
const invesco = require('./adapters/invesco');
const schwab = require('./adapters/schwab');
const vanguard = require('./adapters/vanguard');
const { fixtureFund, loadCurrentFixture } = require('./lib/fixture');
const { fetchText } = require('./lib/fetch');
const { checksum, ensureDirectory, readJson, writeJson } = require('./lib/io');
const { securityId } = require('./lib/identity');
const { validateFund } = require('./lib/validate');

const repositoryRoot = path.resolve(__dirname, '..');
const fixtureMode = process.argv.includes('--fixture');
const configPath = path.join(__dirname, 'config', 'funds.json');
const rawRoot = path.join(__dirname, 'raw');
const outputRoot = path.join(repositoryRoot, 'public', 'data');

const adapters = {
  'blackrock-ca': blackrock,
  'blackrock-us': blackrock,
  invesco,
  schwab,
  'vanguard-us': vanguard
};

function dateStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

async function downloadFund(fund) {
  const adapter = adapters[fund.issuer];
  if (!adapter) throw new Error(`${fund.symbol}: no adapter for ${fund.issuer}`);
  const url = adapter.sourceUrl(fund);
  let body;
  try {
    body = await fetchText(url, { headers: { 'user-agent': 'WizardFolio data pipeline/1.0' } });
  } catch (error) {
    throw new Error(`${fund.symbol}: ${error.message}`);
  }
  const directory = path.join(rawRoot, dateStamp());
  await ensureDirectory(directory);
  const extension = adapter.rawExtension || (fund.issuer.startsWith('vanguard') ? 'json' : 'csv');
  await fs.writeFile(path.join(directory, `${fund.symbol.replace(/[^A-Z0-9.-]/gi, '_')}.${extension}`), body, 'utf8');
  return adapter.parse(body, fund, { sourceUrl: url, retrievedAt: new Date().toISOString(), sourceChecksum: checksum(body) });
}

function serializeFund(fund, validation) {
  return {
    schemaVersion: 1,
    id: fund.id,
    symbol: fund.symbol,
    ticker: fund.ticker,
    name: fund.name || fund.symbol,
    country: fund.country,
    exchange: fund.exchange,
    currency: fund.currency,
    issuer: fund.issuer,
    holdingsDate: fund.holdingsDate,
    retrievedAt: fund.retrievedAt,
    sourceUrl: fund.sourceUrl,
    sourceChecksum: fund.sourceChecksum,
    weightMethod: fund.weightMethod || 'issuer-reported',
    reportedCoverage: fund.reportedCoverage === undefined ? null : Number(fund.reportedCoverage.toFixed(6)),
    coverageWeight: Number(validation.coverageWeight.toFixed(6)),
    quality: validation.quality,
    holdings: fund.holdings.map(holding => ({ ...holding, id: securityId(holding) }))
  };
}

async function main() {
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  const enabled = config.funds.filter(fund => fund.enabled);
  const fixture = fixtureMode ? loadCurrentFixture(repositoryRoot) : null;
  const results = [];

  for (const fund of enabled) {
    try {
      const normalized = fixtureMode ? fixtureFund(fund, fixture) : await downloadFund(fund);
      const validation = validateFund(normalized);
      results.push({ fund: normalized, validation });
    } catch (error) {
      results.push({ fund, validation: { symbol: fund.symbol, quality: 'failed', coverageWeight: 0, publishable: false, errors: [error.message], warnings: [] } });
    }
  }

  const publishable = results.filter(result => result.validation.publishable);
  const versionMaterial = publishable.map(({ fund }) => `${fund.symbol}:${fund.sourceChecksum}`).sort().join('|');
  const version = checksum(versionMaterial).slice(0, 12);

  for (const result of publishable) {
    const outputFile = path.join(outputRoot, 'funds', `${result.fund.symbol}.json`);
    const previous = await readJson(outputFile);
    if (previous?.sourceChecksum === result.fund.sourceChecksum) result.fund.retrievedAt = previous.retrievedAt;
    await writeJson(outputFile, serializeFund(result.fund, result.validation));
  }
  const manifestFile = path.join(outputRoot, 'manifest.json');
  const previousManifest = await readJson(manifestFile);
  const generatedAt = previousManifest?.version === version ? previousManifest.generatedAt : new Date().toISOString();
  await writeJson(manifestFile, {
    schemaVersion: 1,
    version,
    generatedAt,
    fixtureMode,
    funds: results.map(({ fund, validation }) => ({
      symbol: fund.symbol,
      ticker: fund.ticker || String(fund.symbol || '').replace(/\.TO$/i, ''),
      name: fund.name || fund.ticker || fund.symbol,
      country: fund.country,
      exchange: fund.exchange || null,
      currency: fund.currency || null,
      issuer: fund.issuer,
      quality: validation.quality,
      coverageWeight: Number(validation.coverageWeight.toFixed(6)),
      publishable: validation.publishable,
      holdingsDate: fund.holdingsDate || null,
      errors: validation.errors,
      warnings: validation.warnings
    }))
  });
  await writeJson(path.join(outputRoot, 'catalog.json'), {
    schemaVersion: 1,
    version,
    generatedAt,
    funds: publishable.map(({ fund, validation }) => ({
      symbol: fund.symbol,
      ticker: fund.ticker || String(fund.symbol || '').replace(/\.TO$/i, ''),
      name: fund.name || fund.ticker || fund.symbol,
      country: fund.country,
      exchange: fund.exchange || null,
      currency: fund.currency || null,
      issuer: fund.issuer,
      holdingsDate: fund.holdingsDate || null,
      quality: validation.quality,
      coverageWeight: Number(validation.coverageWeight.toFixed(6))
    }))
  });

  console.table(results.map(({ fund, validation }) => ({ symbol: fund.symbol, quality: validation.quality, coverage: `${validation.coverageWeight.toFixed(2)}%`, publishable: validation.publishable })));
  const failures = results.filter(result => result.validation.errors.length);
  if (failures.length) {
    for (const { fund, validation } of failures) console.error(`${fund.symbol}: ${validation.errors.join('; ')}`);
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
