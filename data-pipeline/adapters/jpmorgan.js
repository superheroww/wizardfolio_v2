'use strict';

const { fetchBuffer } = require('../lib/fetch');
const { parseXlsx } = require('../lib/xlsx');

function sourceUrl(fund) {
  if (!fund.cusip) throw new Error(`${fund.symbol} is missing the JPMorgan CUSIP`);
  const query = new URLSearchParams({ type: 'dailyETFHoldings', cusip: fund.cusip, country: 'us', role: 'adv', fundType: 'N_ETF', locale: 'en_US', isUnderlyingHolding: 'false', isProxyHolding: 'false' });
  return `https://am.jpmorgan.com/FundsMarketingHandler/excel?${query}`;
}

async function fetchPayload(fund, options = {}) {
  return (options.fetchBuffer || fetchBuffer)(sourceUrl(fund), { headers: { 'user-agent': 'WizardFolio data pipeline/1.0' } });
}

function typeFor(value) {
  const type = String(value || '').toLowerCase();
  if (type.includes('common stock') || type.includes('equity')) return 'stock';
  if (type.includes('exchange traded') || type.includes('etf')) return 'etf';
  if (type.includes('cash') || type.includes('currency')) return 'cash';
  if (type.includes('bond') || type.includes('note') || type.includes('treasury')) return 'bond';
  return 'other';
}

function parseDate(value) {
  const match = String(value || '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return match ? `${match[3]}-${match[1]}-${match[2]}` : null;
}

function parse(payload, fund, metadata = {}) {
  const rows = parseXlsx(payload);
  const headerIndex = rows.findIndex(row => row.includes('Ticker') && row.includes('Security Description') && row.includes('% of Net Assets'));
  if (headerIndex < 0) throw new Error('JPMorgan holdings header was not found');
  const columns = Object.fromEntries(rows[headerIndex].map((name, index) => [name, index]));
  const holdings = rows.slice(headerIndex + 1).map(row => {
    const name = row[columns['Security Description']];
    const weight = Number(String(row[columns['% of Net Assets']] || '').replace('%', ''));
    if (!name || !Number.isFinite(weight)) return null;
    const ticker = row[columns.Ticker] || null;
    const securityType = row[columns['Security Type']] || null;
    return {
      type: typeFor(securityType), ticker, name, weight,
      marketValue: Number(row[columns['Market Value (USD)']]) || null,
      country: row[columns.Country] || null, marketCurrency: row[columns.Currency] || fund.currency,
      sector: row[columns.Sector] || null, exchange: null, isin: null, cusip: null, sedol: null,
      sourceId: ['JPMORGAN', fund.symbol, ticker, name, securityType, row[columns['Maturity Date']], row[columns['Strike Price']]].join('|')
    };
  }).filter(Boolean);
  const dateRow = rows.find(row => row.some(value => String(value || '').includes('As of Date:')));
  const dateValue = dateRow?.find(value => String(value || '').includes('As of Date:'));
  return {
    ...fund, holdingsDate: metadata.holdingsDate || parseDate(dateValue),
    retrievedAt: metadata.retrievedAt || new Date().toISOString(),
    sourceUrl: metadata.sourceUrl || sourceUrl(fund), sourceChecksum: metadata.sourceChecksum || null,
    weightMethod: 'issuer-reported', reportedCoverage: holdings.reduce((sum, row) => sum + row.weight, 0), holdings
  };
}

module.exports = { fetchPayload, parse, parseDate, rawExtension: 'xlsx', sourceUrl, typeFor };
