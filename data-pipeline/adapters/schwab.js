'use strict';

function sourceUrl(fund) {
  return `https://www.schwabassetmanagement.com/allholdings/${fund.ticker}`;
}

function decode(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isoDate(html) {
  const match = html.match(/As of\s+(\d{2})\/(\d{2})\/(\d{2,4})/i);
  if (!match) return null;
  const year = match[3].length === 2 ? `20${match[3]}` : match[3];
  return `${year}-${match[1]}-${match[2]}`;
}

function cell(row, label) {
  const expression = new RegExp(`<td[^>]*data-label="${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>([\\s\\S]*?)<\\/td>`, 'i');
  return decode(row.match(expression)?.[1]);
}

function parse(html, fund, metadata = {}) {
  const holdings = [];
  for (const match of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const row = match[1];
    const name = cell(row, 'Fund Name');
    const weightText = cell(row, '% of Assets');
    if (!name || !weightText) continue;
    const ticker = cell(row, 'Symbol') || null;
    const cusip = cell(row, 'CUSIP') || null;
    const weight = Number(weightText.replace(/[,%]/g, ''));
    if (!Number.isFinite(weight)) continue;
    holdings.push({
      type: /cash|currency/i.test(name) ? 'cash' : 'stock',
      ticker,
      name,
      weight,
      marketValue: null,
      exchange: null,
      marketCurrency: fund.currency,
      country: fund.country,
      sector: null,
      isin: null,
      cusip,
      sedol: null
    });
  }
  if (!holdings.length) throw new Error('Schwab holdings table was not found');

  return {
    ...fund,
    holdingsDate: isoDate(html),
    retrievedAt: metadata.retrievedAt || new Date().toISOString(),
    sourceUrl: metadata.sourceUrl || sourceUrl(fund),
    sourceChecksum: metadata.sourceChecksum || null,
    weightMethod: 'issuer-reported',
    reportedCoverage: holdings.reduce((sum, holding) => sum + holding.weight, 0),
    holdings
  };
}

module.exports = { parse, rawExtension: 'html', sourceUrl };
