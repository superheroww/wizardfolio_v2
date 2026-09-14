'use strict';

function sourceUrl(fund) {
  return `https://investor.vanguard.com/irr/funds/profile/${fund.ticker}-AdditionalFundData`;
}

function number(value) {
  const parsed = Number(String(value || '').replace(/[$,%]/g, '').replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function isoDate(value) {
  const match = String(value || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[1]}-${match[2]}` : null;
}

function rowType(row, group) {
  if (group === 'equityHoldings') return 'stock';
  if (group === 'fixedIncomeHoldings') return 'bond';
  if (group === 'shortTermReservesHoldings') return 'cash';
  return 'other';
}

function parse(payload, fund, metadata = {}) {
  const document = typeof payload === 'string' ? JSON.parse(payload) : payload;
  const details = document.holdingDetails;
  if (!details) throw new Error('Vanguard holdingDetails was not found');
  const groups = ['equityHoldings', 'fixedIncomeHoldings', 'shortTermReservesHoldings', 'derivativeHoldings', 'commodityHoldings', 'currencyHoldings'];
  const holdings = groups.flatMap(group => (details[group] || []).map(row => ({
    type: rowType(row, group),
    ticker: row.ticker || null,
    name: row.securityLongDescription || row.securityShortDescription || row.securityId,
    weight: number(row.marketValuePercentage),
    marketValue: number(row.marketValueBaseCurrency),
    exchange: row.exchange || null,
    marketCurrency: fund.currency,
    country: row.country || null,
    sector: row.sector || null,
    isin: row.isin || null,
    cusip: row.cusip || null,
    sedol: row.sedol || null
  }))).filter(row => row.weight !== null && (row.weight !== 0 || row.marketValue !== 0));
  const reportedCoverage = holdings.reduce((sum, holding) => sum + holding.weight, 0);
  const totalMarketValue = holdings.reduce((sum, holding) => sum + (holding.marketValue || 0), 0);
  const shouldNormalize = (reportedCoverage < 98 || reportedCoverage > 102) && Math.abs(totalMarketValue) > 0;
  if (shouldNormalize) {
    for (const holding of holdings) holding.weight = (holding.marketValue || 0) / totalMarketValue * 100;
  }

  return {
    ...fund,
    name: document.profile?.fundFullName || fund.name || fund.symbol,
    holdingsDate: isoDate(details.asOfDate),
    retrievedAt: metadata.retrievedAt || new Date().toISOString(),
    sourceUrl: metadata.sourceUrl || sourceUrl(fund),
    sourceChecksum: metadata.sourceChecksum || null,
    weightMethod: shouldNormalize ? 'market-value-normalized' : 'issuer-reported',
    reportedCoverage,
    holdings
  };
}

module.exports = { parse, sourceUrl };
