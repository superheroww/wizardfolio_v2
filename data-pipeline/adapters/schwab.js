'use strict';

const { fetchText } = require('../lib/fetch');

function sourceUrl(fund) {
  return `https://www.schwabassetmanagement.com/allholdings/${fund.ticker}`;
}

function lastPage(html) {
  return Math.max(0, ...Array.from(html.matchAll(/href="\?page=(\d+)"\s+title="Go to last page"/gi), match => Number(match[1])));
}

async function fetchPayload(fund, options = {}) {
  const download = options.fetchText || fetchText;
  const url = sourceUrl(fund);
  const request = page => download(page ? `${url}?page=${page}` : url, {
    headers: { 'user-agent': 'WizardFolio data pipeline/1.0' }
  });
  const pages = [await request(0)];
  const finalPage = lastPage(pages[0]);
  for (let start = 1; start <= finalPage; start += 4) {
    const batch = Array.from({ length: Math.min(4, finalPage - start + 1) }, (_, index) => start + index);
    pages.push(...await Promise.all(batch.map(request)));
  }
  return pages.join('\n');
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

module.exports = { fetchPayload, lastPage, parse, rawExtension: 'html', sourceUrl };
