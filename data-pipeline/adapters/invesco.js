'use strict';

function sourceUrl(fund) {
  if (!fund.cusip) throw new Error(`${fund.symbol} is missing the Invesco CUSIP`);
  return `https://dng-api.invesco.com/cache/v1/accounts/en_US/shareclasses/${fund.cusip}/holdings/fund?idType=cusip&productType=ETF`;
}

function holdingType(row) {
  const value = String(row.securityTypeName || row.securityTypeCode || '').toLowerCase();
  if (value.includes('common') || value.includes('stock') || value.includes('equity')) return 'stock';
  if (value.includes('bond') || value.includes('note') || value.includes('treasury')) return 'bond';
  if (value.includes('cash') || value.includes('currency')) return 'cash';
  if (value.includes('fund') || value.includes('etf')) return 'etf';
  return 'other';
}

function parse(payload, fund, metadata = {}) {
  const document = typeof payload === 'string' ? JSON.parse(payload) : payload;
  if (!Array.isArray(document.holdings)) throw new Error('Invesco holdings were not found');
  const holdings = document.holdings.map(row => ({
    type: holdingType(row),
    ticker: row.ticker || null,
    name: row.issuerName || row.ticker || row.cusip,
    weight: Number(row.percentageOfTotalNetAssets),
    marketValue: Number.isFinite(Number(row.marketValueBase)) ? Number(row.marketValueBase) : null,
    exchange: null,
    marketCurrency: row.currency || fund.currency,
    country: null,
    sector: null,
    isin: null,
    cusip: row.cusip || null,
    sedol: null
  })).filter(row => Number.isFinite(row.weight) && (row.weight !== 0 || row.marketValue !== 0));

  return {
    ...fund,
    holdingsDate: document.effectiveBusinessDate || document.effectiveDate || null,
    retrievedAt: metadata.retrievedAt || new Date().toISOString(),
    sourceUrl: metadata.sourceUrl || sourceUrl(fund),
    sourceChecksum: metadata.sourceChecksum || null,
    weightMethod: 'issuer-reported',
    reportedCoverage: holdings.reduce((sum, holding) => sum + holding.weight, 0),
    holdings
  };
}

module.exports = { parse, rawExtension: 'json', sourceUrl };
