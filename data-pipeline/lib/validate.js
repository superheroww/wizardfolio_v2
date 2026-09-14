'use strict';

const { securityId } = require('./identity');

function qualityFor(weight) {
  if (weight >= 98 && weight <= 102) return 'complete';
  if (weight >= 95 && weight < 98) return 'near-complete';
  if (weight > 0) return 'partial';
  return 'unavailable';
}

function validateFund(fund, options = {}) {
  const errors = [];
  const warnings = [];
  const coverageWeight = fund.holdings.reduce((total, holding) => total + holding.weight, 0);
  const quality = qualityFor(coverageWeight);
  const identities = new Set();

  for (const holding of fund.holdings) {
    try {
      const id = securityId(holding);
      if (identities.has(id)) warnings.push(`Duplicate security identity ${id}`);
      identities.add(id);
    } catch (error) {
      errors.push(error.message);
    }
  }
  if (!fund.sourceUrl) errors.push('Missing source URL');
  if (!fund.retrievedAt) errors.push('Missing retrieval timestamp');
  if (!fund.holdingsDate) {
    errors.push('Missing issuer holdings date');
  } else {
    const now = options.now || new Date();
    const ageDays = Math.floor((now.valueOf() - new Date(`${fund.holdingsDate}T00:00:00Z`).valueOf()) / 86400000);
    const maxDataAgeDays = fund.maxDataAgeDays || options.maxDataAgeDays || 10;
    if (ageDays > maxDataAgeDays) errors.push(`Holdings are stale (${ageDays} days old; maximum ${maxDataAgeDays})`);
  }
  if (quality === 'partial' || quality === 'unavailable') warnings.push(`Coverage is ${coverageWeight.toFixed(4)}%`);

  const finalQuality = errors.some(error => error.startsWith('Holdings are stale')) ? 'stale' : quality;
  return { symbol: fund.symbol, coverageWeight, quality: finalQuality, errors, warnings, publishable: errors.length === 0 && quality === 'complete' };
}

module.exports = { qualityFor, validateFund };
