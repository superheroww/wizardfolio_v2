'use strict';

const { parseCsvLine } = require('../lib/csv');

function sourceUrl(fund) {
  if (!fund.productId || !fund.fileName) throw new Error(`${fund.symbol} is missing BlackRock source configuration`);
  return `https://www.blackrock.com/ca/investors/en/products/${fund.productId}/fund/1464253357814.ajax?fileType=csv&fileName=${fund.fileName}&dataType=fund`;
}

function findHeader(lines) {
  for (let index = 0; index < lines.length; index += 1) {
    const values = parseCsvLine(lines[index]);
    if (values.includes('Ticker') && values.includes('Weight (%)') && values.includes('Asset Class')) {
      return { index, columns: Object.fromEntries(values.map((name, position) => [name, position])) };
    }
  }
  throw new Error('BlackRock CSV header was not found');
}

function normalizeAssetClass(value) {
  const normalized = String(value || '').toLowerCase();
  if (normalized.includes('equity')) return 'stock';
  if (normalized.includes('fixed income')) return 'bond';
  return 'other';
}

function holdingsDate(lines) {
  const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
  for (const line of lines.slice(0, 20)) {
    const values = parseCsvLine(line);
    if (!String(values[0] || '').toLowerCase().includes('holdings as of')) continue;
    const match = String(values[1] || '').trim().match(/^([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{4})$/);
    if (match && months[match[1].slice(0, 3).toLowerCase()] !== undefined) {
      const parsed = new Date(Date.UTC(Number(match[3]), months[match[1].slice(0, 3).toLowerCase()], Number(match[2])));
      return parsed.toISOString().slice(0, 10);
    }
  }
  return null;
}

function parse(csv, fund, metadata = {}) {
  const lines = csv.replace(/^\uFEFF/, '').split(/\r?\n/);
  const header = findHeader(lines);
  const c = header.columns;
  const holdings = [];

  for (const line of lines.slice(header.index + 1)) {
    if (String(parseCsvLine(line)[0] || '').toLowerCase().includes('holdings as of')) break;
    const values = parseCsvLine(line);
    const ticker = values[c.Ticker];
    const weight = Number(String(values[c['Weight (%)']] || '').replace(/,/g, ''));
    if (!ticker || !Number.isFinite(weight) || weight <= 0) continue;
    const configuredChildren = new Set((fund.childSymbols || []).map(value => String(value).toUpperCase()));
    const type = configuredChildren.has(String(ticker).toUpperCase()) ? 'etf' : normalizeAssetClass(values[c['Asset Class']]);
    if (type === 'other') continue;
    holdings.push({
      type,
      ticker,
      name: values[c.Name] || ticker,
      weight,
      sector: values[c.Sector] || null,
      country: values[c.Location] || null,
      exchange: values[c.Exchange] || null,
      marketCurrency: values[c.Currency] || null,
      isin: c.ISIN === undefined ? null : values[c.ISIN] || null,
      cusip: c.CUSIP === undefined ? null : values[c.CUSIP] || null,
      sedol: c.SEDOL === undefined ? null : values[c.SEDOL] || null
    });
  }

  return {
    ...fund,
    holdingsDate: metadata.holdingsDate || holdingsDate(lines),
    retrievedAt: metadata.retrievedAt || new Date().toISOString(),
    sourceUrl: metadata.sourceUrl || sourceUrl(fund),
    sourceChecksum: metadata.sourceChecksum || null,
    holdings
  };
}

module.exports = { parse, sourceUrl };
