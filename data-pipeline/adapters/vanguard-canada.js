'use strict';

const { fetchText } = require('../lib/fetch');

const endpoint = 'https://www.vanguard.ca/gpx/graphql';
const securityTypes = [
  'FI.ABS', 'FI.CONV', 'FI.CORP', 'FI.IP', 'FI.LOAN', 'FI.MBS', 'FI.MUNI', 'FI.NONUS_GOV', 'FI.US_GOV',
  'MM.AGC', 'MM.BACC', 'MM.CD', 'MM.CP', 'MM.MCP', 'MM.RE', 'MM.TBILL', 'MM.TD', 'MM.TFN',
  'EQ.DRCPT', 'EQ.ETF', 'EQ.FSH', 'EQ.PREF', 'EQ.PSH', 'EQ.REIT', 'EQ.STOCK', 'EQ.RIGHT', 'EQ.WRT', 'MF.MF'
];

const query = `query FundsHoldingsQuery($portIds: [String!], $securityTypes: [String!], $lastItemKey: String) {
  funds(portIds: $portIds) { profile { fundFullName fundCurrency } }
  borHoldings(portIds: $portIds) {
    holdings(limit: 1500, securityTypes: $securityTypes, lastItemKey: $lastItemKey) {
      items {
        issuerName securityLongDescription gicsSectorDescription icbSectorDescription
        marketValuePercentage sedol1 ticker securityType effectiveDate
        marketValueBaseCurrency bloombergIsoCountry finalMaturity couponRate
      }
      totalHoldings
      lastItemKey
    }
  }
}`;

function sourceUrl(fund) {
  if (!fund.portId) throw new Error(`${fund.symbol} is missing the Vanguard Canada portId`);
  return endpoint;
}

async function fetchPayload(fund, options = {}) {
  sourceUrl(fund);
  const download = options.fetchText || fetchText;
  const pages = [];
  let lastItemKey = null;

  do {
    const body = await download(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (compatible; WizardFolio data pipeline/1.0)',
        'x-consumer-id': 'ca0',
        referer: 'https://www.vanguard.ca/'
      },
      body: JSON.stringify({ query, variables: { portIds: [String(fund.portId)], securityTypes, lastItemKey } })
    });
    const document = JSON.parse(body);
    if (document.errors?.length) {
      throw new Error(`Vanguard Canada GraphQL error: ${document.errors.map(error => error.message).join('; ')}`);
    }
    const holdings = document.data?.borHoldings?.[0]?.holdings;
    if (!holdings) throw new Error('Vanguard Canada holdings were not found');
    pages.push(document);
    lastItemKey = holdings.lastItemKey || null;
  } while (lastItemKey);

  return JSON.stringify({ pages });
}

function number(value) {
  const parsed = Number(String(value ?? '').replace(/[$,%]/g, '').replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function holdingType(row) {
  if (row.securityType === 'EQ.ETF' || row.securityType === 'MF.MF') return 'etf';
  if (String(row.securityType).startsWith('FI.')) return 'bond';
  if (String(row.securityType).startsWith('MM.')) return 'cash';
  if (String(row.securityType).startsWith('EQ.')) return 'stock';
  return 'other';
}

function sourceId(row, type) {
  if (row.sedol1 || !['stock', 'bond'].includes(type)) return null;
  return [
    'VANGUARD-CA', row.securityType, row.ticker, row.securityLongDescription || row.issuerName,
    row.finalMaturity, row.couponRate, row.bloombergIsoCountry
  ].map(value => String(value ?? '').trim()).join('|');
}

function parse(payload, fund, metadata = {}) {
  const document = typeof payload === 'string' ? JSON.parse(payload) : payload;
  const pages = document.pages || [document];
  const profile = pages[0]?.data?.funds?.[0]?.profile || {};
  const rows = pages.flatMap(page => page.data?.borHoldings?.[0]?.holdings?.items || []);
  if (!rows.length) throw new Error('Vanguard Canada returned no holdings');

  const holdings = rows.map(row => {
    const type = holdingType(row);
    return {
      type,
      ticker: row.ticker || null,
      name: row.securityLongDescription || row.issuerName || row.ticker,
      weight: number(row.marketValuePercentage),
      marketValue: number(row.marketValueBaseCurrency),
      sector: row.gicsSectorDescription || row.icbSectorDescription || null,
      country: row.bloombergIsoCountry || null,
      exchange: null,
      marketCurrency: profile.fundCurrency || fund.currency,
      isin: null,
      cusip: null,
      sedol: row.sedol1 || null,
      sourceId: sourceId(row, type)
    };
  }).filter(row => row.name && row.weight !== null && (row.weight !== 0 || row.marketValue !== 0));

  const reportedCoverage = holdings.reduce((sum, holding) => sum + holding.weight, 0);
  const totalMarketValue = holdings.reduce((sum, holding) => sum + (holding.marketValue || 0), 0);
  const shouldNormalize = (reportedCoverage < 98 || reportedCoverage > 102) && Math.abs(totalMarketValue) > 0;
  if (shouldNormalize) {
    for (const holding of holdings) holding.weight = (holding.marketValue || 0) / totalMarketValue * 100;
  }

  const dates = rows.map(row => String(row.effectiveDate || '').slice(0, 10)).filter(value => /^\d{4}-\d{2}-\d{2}$/.test(value)).sort();
  return {
    ...fund,
    maxDataAgeDays: fund.maxDataAgeDays || 45,
    name: profile.fundFullName || fund.name || fund.symbol,
    holdingsDate: metadata.holdingsDate || dates.at(-1) || null,
    retrievedAt: metadata.retrievedAt || new Date().toISOString(),
    sourceUrl: metadata.sourceUrl || sourceUrl(fund),
    sourceChecksum: metadata.sourceChecksum || null,
    weightMethod: shouldNormalize ? 'market-value-normalized' : 'issuer-reported',
    reportedCoverage,
    holdings
  };
}

module.exports = { endpoint, fetchPayload, holdingType, parse, query, rawExtension: 'json', securityTypes, sourceId, sourceUrl };
