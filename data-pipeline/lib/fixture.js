'use strict';

const path = require('node:path');
const { checksum } = require('./io');

function loadCurrentFixture(repositoryRoot) {
  const catalogPath = path.join(repositoryRoot, 'etf-catalog.js');
  const holdingsPath = path.join(repositoryRoot, 'ishares-holdings.js');
  global.window = { WIZARD_FOLIO_DATA: {} };
  delete require.cache[require.resolve(catalogPath)];
  delete require.cache[require.resolve(holdingsPath)];
  require(catalogPath);
  require(holdingsPath);
  const etfs = global.window.WIZARD_FOLIO_DATA.etfs;
  delete global.window;
  return etfs;
}

function fixtureFund(config, fixture) {
  const aliases = config.symbol.endsWith('.TO')
    ? [config.symbol, config.symbol.slice(0, -3)]
    : [config.symbol, `${config.symbol}.TO`];
  const source = aliases.map(symbol => fixture[symbol]).find(Boolean);
  if (!source || !Array.isArray(source.holdings)) throw new Error(`No typed fixture is available for ${config.symbol}`);
  return {
    ...config,
    name: source.name,
    holdingsDate: source.asOf || null,
    retrievedAt: source.generatedAt || new Date().toISOString(),
    sourceUrl: source.source || null,
    sourceChecksum: checksum(JSON.stringify(source.holdings)),
    holdings: source.holdings.map(holding => ({ ...holding }))
  };
}

module.exports = { fixtureFund, loadCurrentFixture };
