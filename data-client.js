(function initializeDataClient(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.WizardFolioDataClient = api;
})(typeof window === 'undefined' ? null : window, function dataClientFactory() {
  'use strict';

  function displayTicker(fund) {
    return String(fund.ticker || fund.symbol || '').replace(/\.TO$/i, '').toUpperCase();
  }

  function detailFor(fund) {
    const marker = fund.country === 'CA' ? '🍁' : fund.country === 'US' ? '🇺🇸' : '🌎';
    const market = fund.country === 'CA' ? 'Canada-listed ETF' : fund.country === 'US' ? 'U.S.-listed ETF' : 'ETF';
    return `${marker} ${market}`;
  }

  function frontendFund(fund, current = {}) {
    const ticker = displayTicker(fund);
    const publishedName = fund.name && ![ticker, fund.symbol].includes(fund.name) ? fund.name : null;
    const publishedHoldingsCount = fund.holdings?.length || 0;
    return {
      ...current,
      name: publishedName || current.name || ticker,
      detail: current.detail || detailFor(fund),
      holdingsCount: Math.max(publishedHoldingsCount, current.holdingsCount || 0),
      reportedUnderlyingHoldings: Math.max(publishedHoldingsCount, current.reportedUnderlyingHoldings || 0),
      holdings: Array.isArray(fund.holdings) ? fund.holdings : (current.holdings || []),
      sectors: current.sectors || {},
      geography: current.geography || {},
      exchange: fund.exchange || current.exchange || null,
      currency: fund.currency || current.currency || null,
      country: fund.country || current.country || null,
      asOf: fund.holdingsDate || current.asOf || null,
      source: fund.sourceUrl || current.source || null,
      pipelineSymbol: fund.symbol,
      pipelineQuality: fund.quality || current.pipelineQuality || null,
      pipelineLoaded: Array.isArray(fund.holdings)
    };
  }

  function createClient(options) {
    const store = options.store;
    const fetchImpl = options.fetchImpl || fetch;
    const baseUrl = String(options.baseUrl || './public/data').replace(/\/$/, '');
    const loading = new Map();
    let catalog = [];

    function findFund(ticker) {
      const normalized = displayTicker({ ticker });
      return catalog.find(fund => displayTicker(fund) === normalized) || null;
    }

    async function fetchJson(url) {
      const response = await fetchImpl(url, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`ETF data returned HTTP ${response.status}`);
      return response.json();
    }

    async function loadCatalog() {
      const document = await fetchJson(`${baseUrl}/catalog.json`);
      catalog = (document.funds || []).filter(fund => fund.symbol);
      catalog.forEach(fund => {
        const ticker = displayTicker(fund);
        store[ticker] = frontendFund(fund, store[ticker]);
      });
      return catalog;
    }

    async function loadFund(ticker, visited = new Set()) {
      const metadata = findFund(ticker);
      if (!metadata) return store[displayTicker({ ticker })] || null;
      const key = displayTicker(metadata);
      if (visited.has(key)) return store[key] || null;
      if (store[key]?.pipelineLoaded) return store[key];
      if (loading.has(key)) return loading.get(key);

      const promise = (async () => {
        const fund = await fetchJson(`${baseUrl}/funds/${encodeURIComponent(metadata.symbol)}.json`);
        store[key] = frontendFund(fund, store[key]);
        const nextVisited = new Set(visited).add(key);
        const children = store[key].holdings
          .filter(holding => holding.type === 'etf' && holding.ticker)
          .map(holding => displayTicker({ ticker: holding.ticker }));
        await Promise.all(children.map(child => loadFund(child, nextVisited)));
        return store[key];
      })().finally(() => loading.delete(key));

      loading.set(key, promise);
      return promise;
    }

    async function loadFunds(tickers) {
      return Promise.all((tickers || []).map(ticker => loadFund(ticker)));
    }

    return { findFund, loadCatalog, loadFund, loadFunds };
  }

  return { createClient, detailFor, displayTicker, frontendFund };
});
