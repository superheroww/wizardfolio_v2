'use strict';

const clean = value => String(value || '').trim().toUpperCase();
const compact = value => clean(value).replace(/[^A-Z0-9]/g, '');

function securityId(security) {
  if (security.type === 'etf' && security.ticker) return `ETF:${clean(security.ticker)}`;
  if (security.isin) return `ISIN:${compact(security.isin)}`;
  if (security.cusip) return `CUSIP:${compact(security.cusip)}`;
  if (security.sedol) return `SEDOL:${compact(security.sedol)}`;
  if (security.exchange && security.ticker) {
    return `LISTING:${compact(security.exchange)}:${clean(security.ticker)}`;
  }
  if ((security.type === 'cash' || security.type === 'other') && security.name) {
    return `ASSET:${clean(security.type)}:${compact(security.name)}:${compact(security.marketCurrency)}`;
  }
  throw new Error(`Security lacks a stable identity: ${security.name || security.ticker || 'unknown'}`);
}

module.exports = { securityId };
