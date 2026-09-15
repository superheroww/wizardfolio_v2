'use strict';

const { fetchBuffer } = require('../lib/fetch');
const { parseXlsx } = require('../lib/xlsx');

function sourceUrl(fund) {
  return `https://www.ssga.com/library-content/products/fund-data/etfs/us/holdings-daily-us-en-${fund.ticker.toLowerCase()}.xlsx`;
}

async function fetchPayload(fund, options = {}) {
  return (options.fetchBuffer || fetchBuffer)(sourceUrl(fund), { headers: { 'user-agent': 'WizardFolio data pipeline/1.0' } });
}

function parseDate(value) {
  const months = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
  const match = String(value || '').match(/(\d{1,2})-([A-Za-z]{3})-(\d{4})/);
  return match ? `${match[3]}-${months[match[2].toLowerCase()]}-${match[1].padStart(2, '0')}` : null;
}

function parse(payload, fund, metadata = {}) {
  const rows = parseXlsx(payload);
  const headerIndex = rows.findIndex(row => row.includes('Name') && row.includes('Ticker') && row.includes('Weight'));
  if (headerIndex < 0) throw new Error('State Street holdings header was not found');
  const columns = Object.fromEntries(rows[headerIndex].map((name, index) => [name, index]));
  const holdings = rows.slice(headerIndex + 1).map(row => {
    const name = row[columns.Name];
    const ticker = row[columns.Ticker] || null;
    const weight = Number(row[columns.Weight]);
    if (!name || !Number.isFinite(weight)) return null;
    return {
      type: /cash|currency/i.test(name) ? 'cash' : 'stock', ticker, name, weight,
      marketValue: null, sector: row[columns.Sector] || null, country: fund.country,
      exchange: null, marketCurrency: row[columns['Local Currency']] || fund.currency,
      isin: null, cusip: row[columns.Identifier] || null, sedol: row[columns.SEDOL] || null
    };
  }).filter(Boolean);
  const dateRow = rows.find(row => String(row[0] || '').includes('Holdings:'));
  return {
    ...fund, holdingsDate: metadata.holdingsDate || parseDate(dateRow?.[1]),
    retrievedAt: metadata.retrievedAt || new Date().toISOString(),
    sourceUrl: metadata.sourceUrl || sourceUrl(fund), sourceChecksum: metadata.sourceChecksum || null,
    weightMethod: 'issuer-reported', reportedCoverage: holdings.reduce((sum, row) => sum + row.weight, 0), holdings
  };
}

module.exports = { fetchPayload, parse, parseDate, rawExtension: 'xlsx', sourceUrl };
