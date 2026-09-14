'use strict';

const { securityId } = require('./identity');

function qualityFor(weight) {
  if (weight >= 98 && weight <= 102) return 'complete';
  if (weight >= 95 && weight < 98) return 'near-complete';
  if (weight > 0) return 'partial';
  return 'unavailable';
}

function validateFund(fund) {
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
  if (!fund.holdingsDate) errors.push('Missing issuer holdings date');
  if (quality === 'partial' || quality === 'unavailable') warnings.push(`Coverage is ${coverageWeight.toFixed(4)}%`);

  return { symbol: fund.symbol, coverageWeight, quality, errors, warnings, publishable: errors.length === 0 && quality === 'complete' };
}

module.exports = { qualityFor, validateFund };
