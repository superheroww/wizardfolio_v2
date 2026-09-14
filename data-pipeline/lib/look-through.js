'use strict';

const { securityId } = require('./identity');

function aliases(symbol) {
  const normalized = String(symbol || '').trim().toUpperCase();
  return normalized.endsWith('.TO') ? [normalized, normalized.slice(0, -3)] : [normalized, `${normalized}.TO`];
}

function indexFunds(funds) {
  const index = new Map();
  for (const fund of funds) for (const alias of aliases(fund.symbol)) if (!index.has(alias)) index.set(alias, fund);
  return index;
}

function flattenFund(symbol, funds, parentWeight = 1, path = [], visited = new Set()) {
  const index = funds instanceof Map ? funds : indexFunds(funds);
  const fund = aliases(symbol).map(alias => index.get(alias)).find(Boolean);
  if (!fund || visited.has(fund.id || fund.symbol)) return [];
  const visitKey = fund.id || fund.symbol;
  const nextVisited = new Set(visited).add(visitKey);
  const sourcePath = [...path, fund.symbol];

  return fund.holdings.flatMap(holding => {
    const exposure = parentWeight * holding.weight / 100;
    if (!exposure) return [];
    if (holding.type === 'etf') return flattenFund(holding.ticker, index, exposure, sourcePath, nextVisited);
    return [{ ...holding, exposure, path: [...sourcePath, holding.ticker] }];
  });
}

function aggregatePortfolio(allocations, funds) {
  const index = indexFunds(funds);
  const result = new Map();
  for (const allocation of allocations) {
    for (const security of flattenFund(allocation.symbol, index, allocation.weight / 100)) {
      const id = securityId(security);
      const row = result.get(id) || { id, ticker: security.ticker, name: security.name, weight: 0, paths: [] };
      const contribution = security.exposure * 100;
      row.weight += contribution;
      row.paths.push({ contribution, path: security.path });
      result.set(id, row);
    }
  }
  return [...result.values()].sort((left, right) => right.weight - left.weight);
}

module.exports = { aggregatePortfolio, flattenFund, indexFunds };
