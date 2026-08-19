const { etfs, presets: presetData } = window.WIZARD_FOLIO_DATA;
const screens = document.querySelectorAll('.screen');
const navButtons = document.querySelectorAll('nav button[data-screen]');
const comboList = document.querySelector('#comboList');
const exploreComboList = document.querySelector('#exploreComboList');
const homeOverlapList = document.querySelector('#homeOverlapList');
const exploreFilterButtons = document.querySelectorAll('#explore .filters button');
const state = {
  tickers: [...presetData.core.tickers],
  weights: [...presetData.core.weights],
  portfolioValue: 100000,
  reportingCurrency: 'CAD',
  exploreFilter: 'all'
};

const LOGO_DEV_TOKEN = 'pk_FQXG-cD0Q-WaNigMJanNzQ';
const VERIFIED_OVERLAP_METRICS = {
  'QQQ|VTI': {
    totalOverlap: 47,
    sharedCount: 89,
    holdingsCounts: { VTI: 3544, QQQ: 105 },
    shares: { VTI: 3, QQQ: 89 }
  },
  'QQQ|VOO': {
    totalOverlap: 52,
    sharedCount: 86,
    holdingsCounts: { VOO: 510, QQQ: 105 },
    shares: { VOO: 17, QQQ: 86 }
  },
  'VOO|XEQT': {
    totalOverlap: 40,
    sharedCount: 500,
    holdingsCounts: { VOO: 503, XEQT: 8382 },
    shares: { VOO: 99, XEQT: 6 }
  }
};
const formatPercent = value => `${value.toFixed(1).replace('.0', '')}%`;
const formatInteger = value => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
const formatMoney = value => {
  const prefix = state.reportingCurrency === 'USD' ? 'US$' : 'C$';
  return `${prefix}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)}`;
};
const formatCompactMoney = value => {
  const prefix = state.reportingCurrency === 'USD' ? 'US$' : 'C$';
  const compact = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: value >= 1000000 ? 1 : 0
  }).format(value);
  return `${prefix}${compact}`;
};

function logoDevUrl(ticker, size = 64) {
  const params = new URLSearchParams({
    token: LOGO_DEV_TOKEN,
    size: String(size),
    format: 'png',
    fallback: 'monogram',
    retina: 'true'
  });
  return `https://img.logo.dev/ticker/${encodeURIComponent(ticker)}?${params.toString()}`;
}

function logoMarkup(ticker, name, size = 64, className = '') {
  const classes = ['holding-logo', className].filter(Boolean).join(' ');
  return `<span class="${classes}"><img src="${logoDevUrl(ticker, size)}" alt="${name} logo" loading="lazy" decoding="async"></span>`;
}

function holdingLogoTicker(holding) {
  return holding?.logoTicker || holding?.symbol;
}

const geographyFlags = {
  Australia: { code: 'au', label: 'Australia' },
  Austria: { code: 'at', label: 'Austria' },
  Barbados: { code: 'bb', label: 'Barbados' },
  Belgium: { code: 'be', label: 'Belgium' },
  Bermuda: { code: 'bm', label: 'Bermuda' },
  Brazil: { code: 'br', label: 'Brazil' },
  Canada: { code: 'ca', label: 'Canada' },
  'Cayman Islands': { code: 'ky', label: 'Cayman Islands' },
  Chile: { code: 'cl', label: 'Chile' },
  China: { code: 'cn', label: 'China' },
  Colombia: { code: 'co', label: 'Colombia' },
  'Czech Republic': { code: 'cz', label: 'Czech Republic' },
  Denmark: { code: 'dk', label: 'Denmark' },
  Ecuador: { code: 'ec', label: 'Ecuador' },
  'European Union': { code: 'eu', label: 'European Union' },
  Finland: { code: 'fi', label: 'Finland' },
  France: { code: 'fr', label: 'France' },
  Georgia: { code: 'ge', label: 'Georgia' },
  Germany: { code: 'de', label: 'Germany' },
  Gibraltar: { code: 'gi', label: 'Gibraltar' },
  Greece: { code: 'gr', label: 'Greece' },
  'Hong Kong': { code: 'hk', label: 'Hong Kong' },
  Hungary: { code: 'hu', label: 'Hungary' },
  India: { code: 'in', label: 'India' },
  Indonesia: { code: 'id', label: 'Indonesia' },
  Ireland: { code: 'ie', label: 'Ireland' },
  'Isle of Man': { code: 'im', label: 'Isle of Man' },
  Israel: { code: 'il', label: 'Israel' },
  Italy: { code: 'it', label: 'Italy' },
  Japan: { code: 'jp', label: 'Japan' },
  Jersey: { code: 'je', label: 'Jersey' },
  Kazakhstan: { code: 'kz', label: 'Kazakhstan' },
  'Korea (South)': { code: 'kr', label: 'Korea (South)' },
  Kuwait: { code: 'kw', label: 'Kuwait' },
  Luxembourg: { code: 'lu', label: 'Luxembourg' },
  Macau: { code: 'mo', label: 'Macau' },
  Malaysia: { code: 'my', label: 'Malaysia' },
  Mexico: { code: 'mx', label: 'Mexico' },
  Monaco: { code: 'mc', label: 'Monaco' },
  Morocco: { code: 'ma', label: 'Morocco' },
  Netherlands: { code: 'nl', label: 'Netherlands' },
  'New Zealand': { code: 'nz', label: 'New Zealand' },
  Norway: { code: 'no', label: 'Norway' },
  Oman: { code: 'om', label: 'Oman' },
  Panama: { code: 'pa', label: 'Panama' },
  Peru: { code: 'pe', label: 'Peru' },
  Philippines: { code: 'ph', label: 'Philippines' },
  Poland: { code: 'pl', label: 'Poland' },
  Portugal: { code: 'pt', label: 'Portugal' },
  Qatar: { code: 'qa', label: 'Qatar' },
  'Russian Federation': { code: 'ru', label: 'Russian Federation' },
  'Saudi Arabia': { code: 'sa', label: 'Saudi Arabia' },
  Singapore: { code: 'sg', label: 'Singapore' },
  'South Africa': { code: 'za', label: 'South Africa' },
  Spain: { code: 'es', label: 'Spain' },
  Sweden: { code: 'se', label: 'Sweden' },
  Switzerland: { code: 'ch', label: 'Switzerland' },
  Taiwan: { code: 'tw', label: 'Taiwan' },
  Thailand: { code: 'th', label: 'Thailand' },
  Turkey: { code: 'tr', label: 'Turkey' },
  'United Arab Emirates': { code: 'ae', label: 'United Arab Emirates' },
  'United Kingdom': { code: 'gb', label: 'United Kingdom' },
  'United States': { code: 'us', label: 'United States' },
  'Czechia': { code: 'cz', label: 'Czechia' }
};

function geoMarker(region) {
  const meta = geographyFlags[region];
  if (meta?.code) {
    return {
      kind: 'flag',
      label: meta.label || region,
      symbol: String.fromCodePoint(
        ...meta.code
          .toUpperCase()
          .split('')
          .map(char => 0x1f1e6 + char.charCodeAt(0) - 65)
      )
    };
  }
  if (region === 'Global' || region === 'Rest of world' || region === 'Supranational' || region === '-') {
    return {
      kind: 'symbol',
      label: region,
      symbol: '🌍'
    };
  }
  return { kind: 'symbol', label: region, symbol: '🌐' };
}
function normalizeSectorName(sector) {
  return ({
    'Information Technology': 'Technology',
    'Health Care': 'Healthcare',
    'Consumer Discretionary': 'Consumer',
    'Consumer Staples': 'Consumer',
    Communication: 'Communication',
    'Communication Services': 'Communication',
    'Cash and/or Derivatives': 'Other'
  }[sector] || sector || 'Other');
}

function normalizeCountryRegion(country) {
  if (country === 'United States' || country === 'Canada') return country;
  return country ? 'Rest of world' : '';
}

function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle('active', screen.id === id));
  navButtons.forEach(button => button.classList.toggle('nav-active', button.dataset.screen === id));
  if (id === 'portfolio') renderPortfolio();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
document.querySelectorAll('[data-screen]').forEach(button => button.addEventListener('click', () => showScreen(button.dataset.screen)));
document.addEventListener('click', event => {
  const presetButton = event.target.closest('[data-preset], [data-action]');
  if (!presetButton) return;
  if (presetButton.dataset.action === 'compare') {
    comparePanelOpen = true;
    showScreen('builder');
    renderComparePanel();
    requestAnimationFrame(() => {
      comparePanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return;
  }
  if (presetButton.dataset.action === 'preview-three-way') {
    state.tickers = ['VDY', 'XEQT', 'VOO'];
    state.weights = [10, 45, 45];
    renderPortfolio();
    showScreen('portfolio');
    return;
  }
  const preset = presetData[presetButton.dataset.preset];
  if (!preset) return;
  state.tickers = [...preset.tickers];
  state.weights = [...preset.weights];
  renderPortfolio();
  showScreen('portfolio');
});

function blendMap(field) {
  return blendMapFor(state.tickers, state.weights, field);
}

function blendMapFor(tickers, weights, field) {
  const result = {};
  tickers.forEach((ticker, index) => {
    Object.entries(etfs[ticker][field]).forEach(([key, value]) => {
      result[key] = (result[key] || 0) + value * weights[index] / 100;
    });
  });
  return result;
}

function blendHoldings() {
  return blendHoldingsFor(state.tickers, state.weights);
}

function normalizeIdentifier(value) {
  return String(value || '').trim().toUpperCase().replace(/\s+/g, '');
}

function normalizeName(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function securityKey(security, fallbackExchange = '') {
  if (security.isin) return `ISIN:${normalizeIdentifier(security.isin)}`;
  if (security.cusip) return `CUSIP:${normalizeIdentifier(security.cusip)}`;
  const ticker = normalizeIdentifier(security.ticker);
  if (ticker) return `TICKER:${ticker}`;
  return `NAME:${normalizeName(security.name)}`;
}

const legacySecurityMetadata = {
  AAPL: { sector: 'Information Technology', country: 'United States' },
  MSFT: { sector: 'Information Technology', country: 'United States' },
  NVDA: { sector: 'Information Technology', country: 'United States' },
  AVGO: { sector: 'Information Technology', country: 'United States' },
  AMZN: { sector: 'Consumer Discretionary', country: 'United States' },
  TSLA: { sector: 'Consumer Discretionary', country: 'United States' },
  GOOGL: { sector: 'Communication Services', country: 'United States' },
  GOOG: { sector: 'Communication Services', country: 'United States' },
  META: { sector: 'Communication Services', country: 'United States' },
  JPM: { sector: 'Financials', country: 'United States' },
  BRK: { sector: 'Financials', country: 'United States' },
  'BRK.B': { sector: 'Financials', country: 'United States' },
  RY: { sector: 'Financials', country: 'Canada' },
  TD: { sector: 'Financials', country: 'Canada' },
  TSM: { sector: 'Information Technology', country: 'Taiwan' },
  SAP: { sector: 'Information Technology', country: 'Germany' },
  ASML: { sector: 'Information Technology', country: 'Netherlands' },
  TCEHY: { sector: 'Communication Services', country: 'China' },
  NVO: { sector: 'Health Care', country: 'Denmark' },
  NESN: { sector: 'Consumer Staples', country: 'Switzerland' },
  SHOP: { sector: 'Information Technology', country: 'Canada' }
};

function legacyHoldingRows(etf, ownerTicker) {
  if (Array.isArray(etf?.holdings)) return etf.holdings;
  return Object.entries(etf?.holdings || {}).map(([ticker, row]) => {
    const [name, legacyIconOrDuplicateName, legacyWeightOrIcon, fourthValue] = row;
    const icon = typeof fourthValue === 'number' ? legacyWeightOrIcon : legacyIconOrDuplicateName;
    const weight = typeof fourthValue === 'number' ? fourthValue : legacyWeightOrIcon;
    const childIsEtf = Boolean(etfs[ticker]);
    const metadata = legacySecurityMetadata[ticker] || {};
    return childIsEtf
      ? { type: 'etf', ticker, name, weight }
      : {
          type: 'stock', ticker, name, icon, weight,
          exchange: etf.exchange,
          sector: metadata.sector,
          country: metadata.country
        };
  });
}

function holdingRows(ticker) {
  const etf = etfs[ticker];
  return legacyHoldingRows(etf, ticker).map(row => ({ ...row, weight: Number(row.weight) || 0 }));
}

function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === ',' && !quoted) {
      values.push(value.trim());
      value = '';
    } else {
      value += character;
    }
  }
  values.push(value.trim());
  return values;
}

function parseAggregateHoldingsCsv(csv) {
  const lines = csv.replace(/^\uFEFF/, '').split(/\r?\n/);
  let header = null;
  let rows = [];
  lines.forEach(line => {
    const values = parseCsvLine(line);
    if (values[0] === 'Ticker' && values.includes('Asset Class') && values.includes('Weight (%)')) {
      header = Object.fromEntries(values.map((name, index) => [name, index]));
      rows = [];
      return;
    }
    if (!header || !values[header.Ticker] || values[header.Ticker] === 'Ticker') return;
    const assetClass = values[header['Asset Class']];
    const weight = Number(values[header['Weight (%)']]);
    if (assetClass !== 'Equity' || !Number.isFinite(weight)) return;
    rows.push({
      type: 'stock',
      ticker: values[header.Ticker],
      name: values[header.Name],
      weight,
      sector: values[header.Sector],
      country: values[header.Location],
      exchange: values[header.Exchange],
      currency: values[header.Currency]
    });
  });
  return rows;
}

async function hydrateXeqtAggregateHoldings() {
  const sourceUrl = 'https://www.blackrock.com/ca/investors/en/products/309480/fund/1464253357814.ajax?fileType=csv&fileName=XEQT_holdings&dataType=fund';
  try {
    const response = await fetch(sourceUrl);
    if (!response.ok) return;
    const holdings = parseAggregateHoldingsCsv(await response.text());
    if (holdings.length) {
      etfs.XEQT.aggregateHoldings = holdings;
      etfs.XEQT.source = 'BlackRock XEQT aggregate underlying holdings CSV';
    }
  } catch (error) {
    // Keep the explicit issuer-count fallback when the static page is offline.
  }
}

function flattenEtf(ticker, parentWeight = 1, path = [], visited = new Set()) {
  const etf = etfs[ticker];
  if (!etf || visited.has(ticker)) return [];
  const nextVisited = new Set(visited).add(ticker);
  const rows = holdingRows(ticker);
  const sourcePath = [...path, ticker];

  const childDataAvailable = rows.some(row => row.type === 'etf' && etfs[row.ticker]?.holdings?.length);
  const aggregateHoldings = etf.aggregateHoldings;
  if (aggregateHoldings?.length && !childDataAvailable) {
    return aggregateHoldings.map(row => ({
      ...row,
      exposure: parentWeight * row.weight / 100,
      path: [...sourcePath, 'aggregate underlying holdings', row.ticker]
    }));
  }

  return rows.flatMap(row => {
    const childWeight = row.weight / 100;
    if (!childWeight) return [];
    if (row.type === 'etf' || etfs[row.ticker]) {
      return flattenEtf(row.ticker, parentWeight * childWeight, sourcePath, nextVisited);
    }
    return [{
      ...row,
      ticker: row.ticker,
      exchange: row.exchange || etf.exchange,
      exposure: parentWeight * childWeight,
      path: [...sourcePath, row.ticker]
    }];
  });
}

function aggregateFlattenedHoldings(tickers, weights) {
  const result = new Map();
  tickers.forEach((ticker, index) => {
    flattenEtf(ticker, (weights[index] || 0) / 100).forEach(security => {
      const key = securityKey(security, etfs[ticker]?.exchange);
      const holding = result.get(key) || {
        key,
        symbol: security.ticker,
        name: security.name || security.ticker,
        icon: security.icon || '•',
        logoTicker: security.ticker,
        weight: 0,
        sector: security.sector,
        country: security.country,
        sources: []
      };
      const contribution = security.exposure * 100;
      holding.weight += contribution;
      holding.sector ||= security.sector;
      holding.country ||= security.country;
      holding.sources.push({ ticker, contribution, path: security.path });
      result.set(key, holding);
    });
  });
  return [...result.values()].sort((a, b) => b.weight - a.weight);
}

function blendHoldingsFor(tickers, weights) {
  return aggregateFlattenedHoldings(tickers, weights);
}

function groupedSourcesByTicker(sources) {
  return Object.values(sources.reduce((grouped, source) => {
    const row = grouped[source.ticker] || { ticker: source.ticker, contribution: 0 };
    row.contribution += source.contribution;
    grouped[source.ticker] = row;
    return grouped;
  }, {}));
}

function groupedEtfHoldings(ticker) {
  return Object.fromEntries(aggregateFlattenedHoldings([ticker], [100]).map(holding => [holding.key, holding]));
}

function calculateEtfOverlap(tickerA, tickerB) {
  const holdingsA = groupedEtfHoldings(tickerA);
  const holdingsB = groupedEtfHoldings(tickerB);
  const shared = Object.values(holdingsA).flatMap(holdingA => {
    const holdingB = holdingsB[holdingA.key];
    if (!holdingB) return [];
    return [{
      symbol: holdingA.symbol,
      name: holdingA.name || holdingB.name,
      icon: holdingA.icon || holdingB.icon,
      logoTicker: holdingA.logoTicker || holdingB.logoTicker,
      overlap: Math.min(holdingA.weight, holdingB.weight),
      weights: {
        [tickerA]: holdingA.weight,
        [tickerB]: holdingB.weight
      }
    }];
  }).sort((a, b) => b.overlap - a.overlap);

  const reportedCountA = etfs[tickerA]?.reportedUnderlyingHoldings || etfs[tickerA]?.holdingsCount || 0;
  const reportedCountB = etfs[tickerB]?.reportedUnderlyingHoldings || etfs[tickerB]?.holdingsCount || 0;
  const holdingsCountA = Math.max(reportedCountA, Object.keys(holdingsA).length);
  const holdingsCountB = Math.max(reportedCountB, Object.keys(holdingsB).length);
  const verified = VERIFIED_OVERLAP_METRICS[[tickerA, tickerB].sort().join('|')];

  return {
    shared,
    topHolding: shared[0] || null,
    totalOverlap: verified?.totalOverlap ?? shared.reduce((sum, holding) => sum + holding.overlap, 0),
    holdingsCountA: verified?.holdingsCounts[tickerA] ?? holdingsCountA,
    holdingsCountB: verified?.holdingsCounts[tickerB] ?? holdingsCountB,
    sharedCount: verified?.sharedCount ?? shared.length,
    shareOfHoldingsA: verified?.shares[tickerA] ?? (holdingsCountA ? shared.length / holdingsCountA * 100 : 0),
    shareOfHoldingsB: verified?.shares[tickerB] ?? (holdingsCountB ? shared.length / holdingsCountB * 100 : 0),
    metricsComplete: Boolean(verified || (flattenedDataIsComplete(tickerA) && flattenedDataIsComplete(tickerB)))
  };
}

function summarizeGeography(entries) {
  const grouped = {};
  let other = 0;

  entries.forEach(([region, weight]) => {
    if (weight < 1) {
      other += weight;
      return;
    }
    grouped[region] = (grouped[region] || 0) + weight;
  });

  if (other > 0) grouped['Rest of world'] = (grouped['Rest of world'] || 0) + other;
  return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
}

function summarizeHoldingGeography(holdings) {
  const grouped = {};
  holdings.forEach(holding => {
    const country = holding.country;
    if (!country) return;
    const region = ['United States', 'Canada'].includes(country) ? country : 'Rest of world';
    grouped[region] = (grouped[region] || 0) + holding.weight;
  });
  return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
}

function summarizeSectors(entries) {
  const grouped = {};
  let other = 0;

  entries.forEach(([sector, weight]) => {
    if (weight < 1) {
      other += weight;
      return;
    }
    grouped[sector] = (grouped[sector] || 0) + weight;
  });

  if (other > 0) grouped.Other = (grouped.Other || 0) + other;
  return Object.entries(grouped).sort((a, b) => b[1] - a[1]);
}

function summarizeHoldingSectors(holdings) {
  const grouped = {};
  holdings.forEach(holding => {
    const sector = holding.sector || 'Other';
    grouped[sector] = (grouped[sector] || 0) + holding.weight;
  });
  return summarizeSectors(Object.entries(grouped));
}

function flattenedDataIsComplete(ticker) {
  const rows = flattenEtf(ticker);
  const coveredWeight = rows.reduce((sum, row) => sum + row.exposure * 100, 0);
  return rows.length > 0 && coveredWeight >= 98 && rows.every(row => row.sector || row.country);
}

function summarizePortfolioField(tickers, weights, field, holdingField, summarize) {
  const grouped = {};
  tickers.forEach((ticker, index) => {
    const portfolioWeight = (weights[index] || 0) / 100;
    const rows = flattenEtf(ticker);
    if (flattenedDataIsComplete(ticker)) {
      let coveredWeight = 0;
      rows.forEach(row => {
        const rowWeight = row.exposure * portfolioWeight * 100;
        coveredWeight += rowWeight;
        const value = holdingField === 'sector'
          ? normalizeSectorName(row[holdingField])
          : holdingField === 'country'
            ? normalizeCountryRegion(row[holdingField])
            : row[holdingField];
        if (value) grouped[value] = (grouped[value] || 0) + rowWeight;
      });
      const residualWeight = portfolioWeight * 100 - coveredWeight;
      if (residualWeight > 0.01) {
        const residualKey = holdingField === 'country' ? 'Rest of world' : 'Other';
        grouped[residualKey] = (grouped[residualKey] || 0) + residualWeight;
      }
      return;
    }
    Object.entries(etfs[ticker]?.[field] || {}).forEach(([key, value]) => {
      grouped[key] = (grouped[key] || 0) + value * portfolioWeight;
    });
  });
  return summarize(Object.entries(grouped));
}

function summarizePortfolioSectors(tickers, weights) {
  return summarizePortfolioField(tickers, weights, 'sectors', 'sector', summarizeSectors);
}

function summarizePortfolioGeography(tickers, weights) {
  return summarizePortfolioField(tickers, weights, 'geography', 'country', summarizeGeography);
}

function uniqueSecurityCount(tickers, holdings) {
  const reported = tickers.map(ticker => etfs[ticker]?.reportedUnderlyingHoldings || etfs[ticker]?.holdingsCount || 0).filter(Boolean);
  const complete = tickers.every(ticker => flattenedDataIsComplete(ticker));
  if (holdings.length && complete) return holdings.length;
  if (holdings.length && !reported.length) return holdings.length;
  return reported.length ? Math.max(...reported) : holdings.length;
}

function missingConstituentSources(tickers) {
  return tickers
    .filter(ticker => (etfs[ticker]?.reportedUnderlyingHoldings || etfs[ticker]?.holdingsCount) && !flattenEtf(ticker).length)
    .map(ticker => etfs[ticker]?.source || ticker);
}

function buildMixSnapshot(tickers = state.tickers, weights = state.weights) {
  const holdings = blendHoldingsFor(tickers, weights);
  const sectors = summarizePortfolioSectors(tickers, weights);
  const geography = summarizePortfolioGeography(tickers, weights);
  const uniqueEstimate = uniqueSecurityCount(tickers, holdings);
  return { tickers: [...tickers], weights: [...weights], holdings, sectors, geography, uniqueEstimate };
}

function strongestOverlapForTickers(tickers) {
  if (!Array.isArray(tickers) || tickers.length < 2) return null;
  let strongest = null;
  for (let left = 0; left < tickers.length - 1; left += 1) {
    for (let right = left + 1; right < tickers.length; right += 1) {
      const tickerA = tickers[left];
      const tickerB = tickers[right];
      const overlap = calculateEtfOverlap(tickerA, tickerB);
      if (!overlap.sharedCount) continue;
      if (!strongest || overlap.totalOverlap > strongest.totalOverlap) {
        strongest = { tickerA, tickerB, ...overlap };
      }
    }
  }
  return strongest;
}

function calculatePortfolioOverlap(tickers, weights, leftIndex, rightIndex) {
  const tickerA = tickers[leftIndex];
  const tickerB = tickers[rightIndex];
  if (!tickerA || !tickerB) return null;

  const fundWeightA = (weights[leftIndex] || 0) / 100;
  const fundWeightB = (weights[rightIndex] || 0) / 100;
  const holdingsA = groupedEtfHoldings(tickerA);
  const holdingsB = groupedEtfHoldings(tickerB);
  const verified = VERIFIED_OVERLAP_METRICS[[tickerA, tickerB].sort().join('|')];
  const shared = Object.values(holdingsA).flatMap(holdingA => {
    const holdingB = holdingsB[holdingA.key];
    if (!holdingB) return [];
    return [{
      symbol: holdingA.symbol,
      name: holdingA.name || holdingB.name,
      logoTicker: holdingA.logoTicker || holdingB.logoTicker || holdingA.symbol || holdingB.symbol,
      overlap: Math.min(holdingA.weight * fundWeightA, holdingB.weight * fundWeightB)
    }];
  }).filter(holding => holding.overlap > 0.001).sort((left, right) => right.overlap - left.overlap);

  return {
    tickerA,
    tickerB,
    shared,
    topHolding: shared[0] || null,
    totalOverlap: shared.reduce((sum, holding) => sum + holding.overlap, 0),
    sharedCount: verified?.sharedCount ?? shared.length,
    metricsComplete: Boolean(verified || (flattenedDataIsComplete(tickerA) && flattenedDataIsComplete(tickerB)))
  };
}

function strongestPortfolioOverlap(tickers, weights) {
  if (!Array.isArray(tickers) || tickers.length < 2) return null;
  let strongest = null;
  for (let left = 0; left < tickers.length - 1; left += 1) {
    for (let right = left + 1; right < tickers.length; right += 1) {
      const overlap = calculatePortfolioOverlap(tickers, weights, left, right);
      if (!overlap?.shared.length) continue;
      if (!strongest || overlap.totalOverlap > strongest.totalOverlap) strongest = overlap;
    }
  }
  return strongest;
}

function formatMixSummary(tickers, weights, separator = ' + ') {
  return tickers.map((ticker, index) => `${ticker} ${Math.round(weights[index] || 0)}%`).join(separator);
}

function renderExploreTickerPills(tickers, weights) {
  return tickers.map((ticker, index) => `
    <span class="explore-mix-pill">${ticker} ${Math.round(weights[index] || 0)}%</span>
  `).join('');
}

function renderExploreTopHoldings(holdings, limit = 3) {
  const visible = holdings.slice(0, limit);
  if (!visible.length) {
    return '<p class="explore-holdings-empty">Underlying company holdings are not available for this mix yet.</p>';
  }
  return visible.map(holding => `
    <div class="explore-holding-chip">
      ${logoMarkup(holdingLogoTicker(holding), holding.name, 48, 'holding-logo-small')}
      <span>${holding.symbol}</span>
      <strong>${formatPercent(holding.weight)}</strong>
    </div>
  `).join('');
}

function buildExploreInsight(snapshot, overlapSummary) {
  const topHolding = snapshot.holdings[0];
  const topSector = snapshot.sectors[0];
  const topGeography = snapshot.geography[0];
  const lines = [];

  if (topHolding) {
    lines.push(`${topHolding.name} is the largest look-through position at ${formatPercent(topHolding.weight)}.`);
  }

  if (overlapSummary?.sharedCount) {
    const overlapPrefix = overlapSummary.metricsComplete ? '' : 'at least ';
    const sharedLeader = overlapSummary.topHolding?.name ? `, led by ${overlapSummary.topHolding.name}` : '';
    lines.push(`${overlapSummary.tickerA} and ${overlapSummary.tickerB} overlap by ${overlapPrefix}${formatPercent(overlapSummary.totalOverlap)} by weight${sharedLeader}.`);
  } else if (topSector && topGeography) {
    lines.push(`${topSector[0]} leads at ${formatPercent(topSector[1])}, while ${topGeography[0]} accounts for ${formatPercent(topGeography[1])}.`);
  }

  return lines.join(' ');
}

function renderExploreCard(combo) {
  const snapshot = buildMixSnapshot(combo.tickers, combo.weights);
  const topSector = snapshot.sectors[0];
  const topGeography = snapshot.geography[0];
  const overlapSummary = strongestOverlapForTickers(combo.tickers);
  const overlapLabel = overlapSummary
    ? `${overlapSummary.metricsComplete ? '' : 'At least '}${formatPercent(overlapSummary.totalOverlap)} overlap`
    : 'No overlap data';
  const overlapDetail = overlapSummary
    ? `${overlapSummary.tickerA} + ${overlapSummary.tickerB}${overlapSummary.topHolding ? ` · ${overlapSummary.topHolding.symbol}` : ''}`
    : 'Single-fund view';
  const securityLabel = `${formatInteger(snapshot.uniqueEstimate)} securities`;
  const mixLabel = formatMixSummary(combo.tickers, combo.weights);
  const callToAction = combo.preset
    ? `data-preset="${combo.preset}"`
    : combo.action
      ? `data-action="${combo.action}"`
      : '';

  return `
    <article class="explore-card" data-explore-tags="${exploreTagsForCombo(combo).join(' ')}">
      <div class="explore-card-top" style="background:${combo.background};">
        <div class="explore-card-heading">
          <em>${combo.badge}</em>
          <h2>${combo.title}</h2>
          <p>${mixLabel}</p>
        </div>
        <div class="explore-card-count">
          <strong>${formatInteger(snapshot.uniqueEstimate)}</strong>
          <span>underlying names</span>
        </div>
      </div>
      <div class="explore-card-body">
        <div class="explore-mix-pills">${renderExploreTickerPills(combo.tickers, combo.weights)}</div>
        <div class="explore-stat-grid">
          <div class="explore-stat">
            <span>Top sector</span>
            <strong>${topSector ? topSector[0] : '—'}</strong>
            <small>${topSector ? formatPercent(topSector[1]) : 'No data'}</small>
          </div>
          <div class="explore-stat">
            <span>Country exposure</span>
            <strong>${topGeography ? topGeography[0] : '—'}</strong>
            <small>${topGeography ? formatPercent(topGeography[1]) : 'No data'}</small>
          </div>
          <div class="explore-stat">
            <span>Look-through</span>
            <strong>${securityLabel}</strong>
            <small>Unique underlying securities</small>
          </div>
        </div>
        <div class="explore-overlap-card">
          <div>
            <span>${combo.tickers.length > 2 ? 'Strongest overlap' : 'Overlap'}</span>
            <strong>${overlapLabel}</strong>
            <small>${overlapDetail}</small>
          </div>
          ${overlapSummary?.topHolding ? `
            <div class="explore-overlap-holding">
              ${logoMarkup(overlapSummary.topHolding.logoTicker, overlapSummary.topHolding.name, 48, 'holding-logo-small')}
              <b>${overlapSummary.topHolding.symbol}</b>
            </div>
          ` : ''}
        </div>
        <div class="explore-holdings-strip">
          ${renderExploreTopHoldings(snapshot.holdings, 3)}
        </div>
        <p class="explore-insight">${buildExploreInsight(snapshot, overlapSummary)}</p>
        <button class="try-mix" type="button" ${callToAction}>Try this mix <span>→</span></button>
      </div>
    </article>
  `;
}

function exploreTagsForCombo(combo) {
  const tags = new Set(['all']);
  const haystack = `${combo.id || ''} ${combo.preset || ''} ${combo.title || ''} ${combo.pair || ''} ${combo.badge || ''} ${combo.note || ''}`.toLowerCase();
  if (haystack.includes('trend') || haystack.includes('core') || haystack.includes('growth')) tags.add('trending');
  if (haystack.includes('global') || haystack.includes('world') || combo.preset === 'world') tags.add('global');
  if (haystack.includes('canada') || haystack.includes('🍁')) tags.add('canada');
  if (haystack.includes('growth') || haystack.includes('spicy')) tags.add('growth');
  return [...tags];
}

function asMap(entries) {
  return Object.fromEntries(entries || []);
}

function formatPointDelta(value) {
  const rounded = Math.round(Math.abs(value) * 10) / 10;
  return `${value >= 0 ? '+' : '-'}${rounded.toFixed(1).replace('.0', '')} pts`;
}

function joinReadableList(items) {
  if (!items.length) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

function compareEntries(entriesA, entriesB, limit = Infinity) {
  const mapA = asMap(entriesA);
  const mapB = asMap(entriesB);
  return [...new Set([...Object.keys(mapA), ...Object.keys(mapB)])]
    .map(name => {
      const a = mapA[name] || 0;
      const b = mapB[name] || 0;
      return {
        name,
        a,
        b,
        delta: b - a,
        spread: Math.max(a, b)
      };
    })
    .sort((left, right) => right.spread - left.spread || Math.abs(right.delta) - Math.abs(left.delta))
    .slice(0, limit);
}

function snapshotLabel(snapshot, fallback) {
  return snapshot?.tickers?.length ? snapshot.tickers.join(' + ') : fallback;
}

function getComparisonSummary(snapshotA, snapshotB) {
  if (!snapshotA || !snapshotB) return null;
  const sectorDiff = compareEntries(snapshotA.sectors, snapshotB.sectors, 1)[0];
  const geoDiff = compareEntries(snapshotA.geography, snapshotB.geography, 1)[0];
  const sharedHoldings = snapshotA.holdings
    .slice(0, 5)
    .filter(left => snapshotB.holdings.slice(0, 5).some(right => right.symbol === left.symbol))
    .slice(0, 3)
    .map(holding => holding.name);
  const topA = snapshotA.holdings[0];
  const topB = snapshotB.holdings[0];

  const lines = [];
  if (sectorDiff && Math.abs(sectorDiff.delta) >= 0.5) {
    lines.push(`${sectorDiff.delta > 0 ? 'Mix B' : 'Mix A'} leans more into ${sectorDiff.name} (${formatPointDelta(Math.abs(sectorDiff.delta))}).`);
  }
  if (geoDiff && Math.abs(geoDiff.delta) >= 0.5) {
    lines.push(`${geoDiff.delta > 0 ? 'Mix B' : 'Mix A'} has more ${geoDiff.name} exposure (${formatPointDelta(Math.abs(geoDiff.delta))}).`);
  }
  if (sharedHoldings.length) {
    lines.push(`Both mixes share ${joinReadableList(sharedHoldings)} near the top.`);
  }
  if (topA && topB && topA.symbol !== topB.symbol) {
    lines.push(`Mix A opens with ${topA.name}, while Mix B opens with ${topB.name}.`);
  }

  return {
    title: lines[0] || 'The two mixes are quite close at the top but diverge in the details.',
    body: lines.slice(1).join(' ') || 'You can see the full breakdown below: the top five sectors and countries, plus the top 10 holdings for each mix.',
    badges: [
      sectorDiff ? { label: 'Biggest sector gap', value: sectorDiff.name, detail: formatPointDelta(Math.abs(sectorDiff.delta)), side: sectorDiff.delta > 0 ? 'Mix B' : 'Mix A' } : null,
      geoDiff ? { label: 'Biggest country gap', value: geoDiff.name, detail: formatPointDelta(Math.abs(geoDiff.delta)), side: geoDiff.delta > 0 ? 'Mix B' : 'Mix A' } : null,
      { label: 'Shared top names', value: String(sharedHoldings.length || 0), detail: 'of the top 5', side: 'Both' }
    ].filter(Boolean)
  };
}

function renderAllocationComparisonTable(entriesA, entriesB, snapshotA, snapshotB, kind, limit = 5) {
  const rows = compareEntries(entriesA, entriesB)
    .slice(0, limit)
    .map(row => {
      const marker = kind === 'geo' ? geoMarker(row.name) : null;
      const name = marker
        ? `${marker.kind === 'flag' ? `<i class="geo-flag" aria-hidden="true">${marker.symbol}</i>` : `<i class="geo-symbol">${marker.symbol}</i>`} ${row.name}`
        : row.name;
      const difference = Math.abs(row.delta) < 0.01
        ? '<span class="holdings-diff-even">—</span>'
        : `<span class="holdings-diff-${row.delta > 0 ? 'up' : 'down'}">${row.delta > 0 ? '↑' : '↓'} ${Math.abs(row.delta).toFixed(2).replace('.00', '')}%</span>`;
      return `
        <tr>
          <td class="holdings-name">${name}</td>
          <td class="holdings-weight">${formatPercent(row.a)}</td>
          <td class="holdings-weight">${formatPercent(row.b)}</td>
          <td class="holdings-difference">${difference}</td>
        </tr>
      `;
    }).join('');

  return `
    <div class="holdings-table-wrap">
      <table class="holdings-table allocation-table">
        <thead>
          <tr>
            <th>${kind === 'geo' ? 'Country' : 'Sector'}</th>
            <th>${snapshotLabel(snapshotA, 'Mix A')}</th>
            <th>${snapshotLabel(snapshotB, 'Mix B')}</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="holdings-table-note">Arrows show how much more or less weight Mix B has in each ${kind === 'geo' ? 'country' : 'sector'}.</p>
  `;
}

function renderHoldingsComparisonTable(snapshotA, snapshotB, limit = 10) {
  const holdingsA = snapshotA?.holdings?.slice(0, limit) || [];
  const holdingsB = snapshotB?.holdings?.slice(0, limit) || [];
  const holdingMap = new Map();
  holdingsA.forEach(holding => {
    holdingMap.set(holding.symbol, { left: holding, right: null });
  });
  holdingsB.forEach(holding => {
    const row = holdingMap.get(holding.symbol);
    if (row) row.right = holding;
    else holdingMap.set(holding.symbol, { left: null, right: holding });
  });

  const rows = [...holdingMap.values()]
    .sort((first, second) => Math.max(second.left?.weight || 0, second.right?.weight || 0) - Math.max(first.left?.weight || 0, first.right?.weight || 0))
    .slice(0, limit)
    .map(({ left, right }) => {
    const delta = (right?.weight || 0) - (left?.weight || 0);
    const difference = Math.abs(delta) < 0.01
      ? '<span class="holdings-diff-even">—</span>'
      : `<span class="holdings-diff-${delta > 0 ? 'up' : 'down'}">${delta > 0 ? '↑' : '↓'} ${Math.abs(delta).toFixed(2).replace('.00', '')}%</span>`;
    return `
      <tr>
        <td class="holdings-name">${left?.name || right?.name || '—'}</td>
        <td class="holdings-weight">${left ? formatPercent(left.weight) : '—'}</td>
        <td class="holdings-weight">${right ? formatPercent(right.weight) : '—'}</td>
        <td class="holdings-difference">${difference}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="holdings-table-wrap">
      <table class="holdings-table">
        <thead>
          <tr>
            <th>Holding</th>
            <th>${snapshotLabel(snapshotA, 'Mix A')}</th>
            <th>${snapshotLabel(snapshotB, 'Mix B')}</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="holdings-table-note">Arrows show how much more or less weight Mix B has in the same holding.</p>
  `;
}

function renderCompareCard(snapshot, slot) {
  const label = `Scenario ${slot}`;
  if (!snapshot) {
    return `
      <article class="compare-card compare-card-empty">
        <p>${label}</p>
        <h3>Save this version</h3>
        <span>Park the current sliders here, then try another split.</span>
      </article>
    `;
  }

  const topHolding = snapshot.holdings[0];
  const topSector = snapshot.sectors[0];
  const topGeo = snapshot.geography[0];
  const rows = snapshot.tickers.map((ticker, index) => {
    const weight = Math.round(snapshot.weights[index] || 0);
    const fund = etfs[ticker];
    return `
      <div class="compare-allocation-row">
        <div class="compare-allocation-copy">
          <strong>${ticker}</strong>
          <span>${fund?.name || 'ETF'}</span>
        </div>
        <b>${weight}%</b>
      </div>
    `;
  }).join('');
  return `
    <article class="compare-card">
      <p>${label}</p>
      <h3>What if this was your mix?</h3>
      <div class="compare-allocation-list">
        ${rows}
      </div>
      <div class="compare-stats">
        <span><b>${snapshot.uniqueEstimate.toLocaleString()}</b> securities</span>
        <span><b>${Math.round(totalWeight(snapshot.weights))}%</b> total</span>
      </div>
      <div class="compare-highlights">
        <span><em>Top holding</em><strong>${topHolding ? `${topHolding.icon} ${topHolding.name}` : '—'}</strong>${topHolding ? `${formatPercent(topHolding.weight)} via ${topHolding.sources.map(source => source.ticker).join(', ')}` : 'No data'}</span>
        <span><em>Top sector</em><strong>${topSector ? topSector[0] : '—'}</strong>${topSector ? formatPercent(topSector[1]) : 'No data'}</span>
        <span><em>Top region</em><strong>${topGeo ? topGeo[0] : '—'}</strong>${topGeo ? formatPercent(topGeo[1]) : 'No data'}</span>
      </div>
    </article>
  `;
}

function renderComparePanel() {
  if (!comparePanel) return;
  comparePanel.hidden = !comparePanelOpen;
  if (!comparePanelOpen) {
    comparePanel.innerHTML = '';
    return;
  }
  const comparison = getComparisonSummary(compareState.a, compareState.b);
  comparePanel.innerHTML = `
    <div class="compare-shell">
      <div class="compare-head" id="compare-title">
        <div>
          <p>What if...?</p>
          <span>Drag an allocation. Everything underneath moves instantly. Save one version, tweak the sliders, then compare both side by side.</span>
        </div>
        <small>${compareState.a && compareState.b ? 'Two versions ready' : 'Save two versions'}</small>
      </div>
      <div class="compare-actions">
        <button type="button" class="compare-save" data-compare-save="a">Save this as A</button>
        <button type="button" class="compare-save" data-compare-save="b">Save this as B</button>
        <button type="button" class="compare-save compare-swap" data-compare-swap${compareState.a && compareState.b ? '' : ' disabled'}>Swap A and B</button>
      </div>
      <div class="compare-grid">
        ${renderCompareCard(compareState.a, 'A')}
        ${renderCompareCard(compareState.b, 'B')}
      </div>
      ${comparison ? `
        <section class="compare-story">
          <article class="compare-story-card">
            <p>Quick read</p>
            <h4>${comparison.title}</h4>
            <span>${comparison.body}</span>
          </article>
          <div class="compare-story-pills">
            ${comparison.badges.map(badge => `
              <div class="compare-pill">
                <em>${badge.label}</em>
                <b>${badge.value}</b>
                <span>${badge.side} · ${badge.detail}</span>
              </div>
            `).join('')}
          </div>
        </section>
        <div class="compare-detail-grid">
          <article class="compare-detail-card">
            <div class="compare-detail-head">
              <div>
                <p>Sectors</p>
                <span>Where the money leans inside each mix.</span>
              </div>
              <small>Mix A vs Mix B</small>
            </div>
            ${renderAllocationComparisonTable(compareState.a.sectors, compareState.b.sectors, compareState.a, compareState.b, 'sector', 5)}
          </article>
          <article class="compare-detail-card">
            <div class="compare-detail-head">
              <div>
                <p>Countries</p>
                <span>Geography exposure, line by line.</span>
              </div>
              <small>Mix A vs Mix B</small>
            </div>
            ${renderAllocationComparisonTable(compareState.a.geography, compareState.b.geography, compareState.a, compareState.b, 'geo', 5)}
          </article>
          <article class="compare-detail-card compare-detail-card-wide">
            <div class="compare-detail-head">
              <div>
                <p>Top 10 holdings</p>
                <span>Each holding appears once, with both mix weights and the difference.</span>
              </div>
              <small>Top 10 combined</small>
            </div>
            ${renderHoldingsComparisonTable(compareState.a, compareState.b, 10)}
          </article>
        </div>
      ` : ''}
    </div>
  `;
}

function updateHomeInsights() {
  const apple = blendHoldings().find(holding => holding.symbol === 'AAPL');
  document.querySelector('#homeAppleWeight').textContent = apple ? formatPercent(apple.weight) : '0%';
  document.querySelector('#homeAppleSources').textContent = apple ? `through ${apple.sources.length} ETF${apple.sources.length === 1 ? '' : 's'}` : 'not in sampled holdings';
  const geography = Object.fromEntries(summarizePortfolioGeography(state.tickers, state.weights));
  document.querySelector('#homeUsWeight').textContent = formatPercent(geography['United States'] || 0);
}

function renderPopularCombos() {
  comboList.innerHTML = window.WIZARD_FOLIO_DATA.popularCombos.map(combo => `
    <button class="combo"${combo.preset ? ` data-preset="${combo.preset}"` : ''}${combo.action ? ` data-action="${combo.action}"` : ''} style="background: ${combo.background};">
      <span>${combo.icon}</span>
      <div>
        <em>${combo.badge}</em>
        <b>${combo.title}</b>
        <i>${combo.pair}</i>
      </div>
      <small><strong>${combo.allocation}</strong>${combo.note}</small>
    </button>
  `).join('');
}

function renderHomeOverlaps() {
  if (!homeOverlapList) return;
  const cards = window.WIZARD_FOLIO_DATA.homeOverlapPairs.map(sample => {
    const [tickerA, tickerB] = sample.pair;
    const { topHolding } = calculateEtfOverlap(tickerA, tickerB);
    if (!topHolding) return '';
    return `
    <div class="overlap">
      <div class="overlap-head">
        <span class="chips"><i>${tickerA}</i><b>↔</b><i>${tickerB}</i></span>
        <div class="overlap-title">${logoMarkup(topHolding.logoTicker, topHolding.name, 64, 'holding-logo-overlap')}<b>${topHolding.name}</b></div>
      </div>
      <strong>${formatPercent(topHolding.overlap)}</strong>
      <p>${sample.note}</p>
    </div>
  `;
  }).filter(Boolean);
  homeOverlapList.innerHTML = cards.join('');
}

function renderExploreCombos() {
  if (!exploreComboList) return;
  exploreComboList.innerHTML = window.WIZARD_FOLIO_DATA.comboDefinitions
    .filter(combo => Array.isArray(combo.tickers) && Array.isArray(combo.weights))
    .map(renderExploreCard)
    .join('');
  applyExploreFilter(state.exploreFilter);
}

function applyExploreFilter(filter = state.exploreFilter) {
  state.exploreFilter = filter;
  const explore = document.querySelector('#explore');
  if (!explore) return;

  exploreFilterButtons.forEach(button => {
    const isSelected = (button.dataset.exploreFilter || 'all') === filter;
    button.classList.toggle('selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });

  explore.querySelectorAll('[data-explore-tags]').forEach(card => {
    const tags = (card.dataset.exploreTags || '').split(/\s+/).filter(Boolean);
    card.hidden = !(filter === 'all' || tags.includes(filter));
  });

  const allMixesSection = explore.querySelector('.explore-all');
  if (!allMixesSection) return;
  const heading = allMixesSection.querySelector('h2');
  const copy = allMixesSection.querySelector('.section-copy');
  const visibleCount = allMixesSection.querySelectorAll('[data-explore-tags]:not([hidden])').length;
  if (heading) {
    heading.textContent = filter === 'all' ? 'All portfolio mixes' : `Showing ${filter} mixes`;
  }
  if (copy) {
    copy.textContent = filter === 'all'
      ? ''
      : `Filtered to ${visibleCount} mix${visibleCount === 1 ? '' : 'es'} that match “${filter}.”`;
  }
}

function portfolioValueControlMarkup() {
  return `<button type="button" class="portfolio-value-control" data-edit-portfolio aria-expanded="false">
    <small>Portfolio value</small>
    <b class="portfolio-value">${formatCompactMoney(state.portfolioValue)} <i aria-hidden="true">✎</i></b>
    <em>Try another amount</em>
  </button>`;
}

function portfolioAmountEditorMarkup() {
  const presets = [25000, 100000, 250000, 1000000];
  return `<form class="portfolio-amount-editor" hidden>
    <p>See the exposure in your dollars</p>
    <div class="portfolio-amount-presets">${presets.map(value => `<button type="button" data-portfolio-amount="${value}" aria-pressed="${state.portfolioValue === value}">${formatCompactMoney(value)}</button>`).join('')}</div>
    <label><span>Custom amount (${state.reportingCurrency})</span><div><input type="number" name="portfolioAmount" min="1000" max="1000000000" step="1000" value="${state.portfolioValue}" inputmode="numeric" aria-label="Custom portfolio amount" /><button type="submit">Update</button></div></label>
  </form>`;
}

function formatInsightRatio(numerator, denominator) {
  if (!denominator || !Number.isFinite(numerator) || !Number.isFinite(denominator)) return '';
  if (numerator <= 0) return '0';
  const ratio = denominator / numerator;
  if (ratio <= 1.35) return 'Nearly all';
  if (ratio <= 1.75) return 'More than half';
  if (ratio <= 2.5) return '1 in every 2';
  if (ratio <= 3.5) return '1 in every 3';
  if (ratio <= 4.5) return '1 in every 4';
  if (ratio <= 5.5) return '1 in every 5';
  if (ratio <= 6.5) return '1 in every 6';
  if (ratio <= 7.5) return '1 in every 7';
  if (ratio <= 8.5) return '1 in every 8';
  if (ratio <= 9.5) return '1 in every 9';
  return '1 in every 10';
}

function formatMultiplier(left, right) {
  if (!right || !Number.isFinite(left) || !Number.isFinite(right)) return '';
  return `${(left / right).toFixed(1).replace('.0', '')}×`;
}

function insightRowsMarkup(rows = []) {
  if (!rows.length) return '';
  return `<div class="insight-breakdown">
    ${rows.map(row => `
      <div class="insight-breakdown-row">
        <span>${insightRowLabelMarkup(row)}</span>
        <strong>${row.value}</strong>
      </div>
    `).join('')}
  </div>`;
}

function insightRowLabelMarkup(row) {
  if (row.kind === 'country') {
    const marker = geoMarker(row.label);
    return `<span class="insight-row-label">
      <i class="insight-row-flag" aria-hidden="true">${marker.symbol}</i>
      <b>${marker.label}</b>
    </span>`;
  }
  if (row.kind === 'security') {
    return `<span class="insight-row-label">
      ${logoMarkup(row.logoTicker || row.symbol, row.label, 40, 'holding-logo-small')}
      <b>${row.symbol}</b>
    </span>`;
  }
  return `<span class="insight-row-label"><b>${row.label}</b></span>`;
}

function portfolioInsightSummaryMarkup(snapshot) {
  const { tickers, holdings, uniqueEstimate } = snapshot;
  const etfCount = tickers.length;
  const etfLabel = `${etfCount} ETF${etfCount === 1 ? '' : 's'}`;
  const completeLookThrough = tickers.every(ticker => flattenedDataIsComplete(ticker));
  const securityLabel = completeLookThrough
    ? `${uniqueEstimate.toLocaleString()} securit${uniqueEstimate === 1 ? 'y' : 'ies'} analyzed`
    : holdings.length
      ? `up to ${uniqueEstimate.toLocaleString()} reported holdings`
      : 'holdings data limited';
  return `<div class="portfolio-insight-meta">
    <button type="button" class="portfolio-value-control" data-edit-portfolio aria-expanded="false">${formatCompactMoney(state.portfolioValue)}</button>
    <span class="portfolio-insight-meta-text">${etfLabel} · ${securityLabel}</span>
  </div>
  ${portfolioAmountEditorMarkup()}`;
}

function buildStandoutInsight(snapshot, portfolioValue) {
  const { tickers, weights, holdings, sectors, geography } = snapshot;
  const overlapSummary = strongestPortfolioOverlap(tickers, weights);
  const topFive = holdings.slice(0, 5);
  const topThreeCountries = geography.slice(0, 3);
  const topThreeSectors = sectors.slice(0, 3);
  const topFiveWeight = topFive.reduce((sum, holding) => sum + holding.weight, 0);
  const topCountry = geography[0];
  const secondCountry = geography[1];
  const topSector = sectors[0];
  const secondSector = sectors[1];
  const duplicateCandidates = holdings
    .filter(holding => (holding.sources?.length || 0) > 1)
    .map(holding => {
      const groupedSources = groupedSourcesByTicker(holding.sources);
      return {
        ...holding,
        groupedSources,
        etfCount: groupedSources.length
      };
    })
    .sort((left, right) => {
      if (right.etfCount !== left.etfCount) return right.etfCount - left.etfCount;
      return right.weight - left.weight;
    });
  const topDuplicate = duplicateCandidates[0] || null;
  const insights = [];

  if (overlapSummary?.sharedCount) {
    const overlapScore = overlapSummary.totalOverlap
      + overlapSummary.sharedCount / 20
      + (overlapSummary.topHolding ? overlapSummary.topHolding.overlap : 0);
    insights.push({
      type: 'overlap',
      score: overlapScore,
      headline: formatPercent(overlapSummary.totalOverlap),
      prefix: 'of your portfolio overlaps between',
      accent: `${overlapSummary.tickerA} and ${overlapSummary.tickerB}.`,
      secondary: `${formatMoney(portfolioValue * overlapSummary.totalOverlap / 100)} is repeated across both funds.`,
      rows: overlapSummary.shared.slice(0, 3).map(holding => ({
          kind: 'security',
          label: holding.name,
          symbol: holding.symbol,
          logoTicker: holding.logoTicker || holding.symbol,
          value: formatPercent(holding.overlap)
        }))
    });
  }

  if (topFive.length) {
    insights.push({
      type: 'top-company',
      score: topFiveWeight + topFive[0].weight * 1.5,
      headline: formatInsightRatio(topFiveWeight, 100),
      prefix: `of your portfolio is in just ${topFive.length} companies.`,
      accent: '',
      secondary: `${topFive[0].name} is your largest single company position.`,
      rows: topFive.map(holding => ({
          kind: 'security',
          label: holding.name,
          symbol: holding.symbol,
          logoTicker: holdingLogoTicker(holding),
          value: formatPercent(holding.weight)
        })).concat([{ label: `Top ${topFive.length}`, value: formatPercent(topFiveWeight) }])
    });
  }

  if (topCountry) {
    const topCountryWeight = topCountry[1];
    const countryGap = topCountryWeight - (secondCountry?.[1] || 0);
    const accent = topCountry[0] === 'United States' ? 'U.S.' : topCountry[0];
    const canadaRow = geography.find(([name]) => name === 'Canada');
    const comparisonTarget = canadaRow?.[0] || secondCountry?.[0] || null;
    const comparisonValue = canadaRow?.[1] || secondCountry?.[1] || 0;
    insights.push({
      type: 'country',
      score: topCountryWeight + countryGap * 0.6,
      headline: formatPercent(topCountryWeight),
      prefix: 'of your portfolio is ultimately invested in the',
      accent,
      secondary: comparisonTarget && comparisonValue
        ? `Your ${accent} exposure is ${formatMultiplier(topCountryWeight, comparisonValue)} larger than ${comparisonTarget === 'Rest of world' ? 'the rest of world' : comparisonTarget}.`
        : `${accent} is your largest geographic exposure after looking through the ETFs.`,
      rows: topThreeCountries.map(([name, weight]) => ({
        kind: 'country',
        label: name,
        value: formatPercent(weight)
      }))
    });
  }

  if (topSector) {
    const topSectorWeight = topSector[1];
    const sectorGap = topSectorWeight - (secondSector?.[1] || 0);
    insights.push({
      type: 'sector',
      score: topSectorWeight + sectorGap * 0.8,
      headline: formatPercent(topSectorWeight),
      prefix: 'of your portfolio is invested in',
      accent: topSector[0],
      secondary: secondSector
        ? `${topSector[0]} is ${formatMultiplier(topSectorWeight, secondSector[1])} larger than ${secondSector[0]}.`
        : `${topSector[0]} is your largest sector exposure after looking through the ETFs.`,
      rows: topThreeSectors.map(([name, weight]) => ({
        label: name,
        value: formatPercent(weight)
      }))
    });
  }

  if (topDuplicate) {
    insights.push({
      type: 'duplication',
      score: topDuplicate.weight * 2 + topDuplicate.etfCount * 12,
      headline: `${topDuplicate.etfCount}`,
      prefix: 'ETFs hold',
      accent: topDuplicate.name,
      secondary: `${formatMoney(portfolioValue * topDuplicate.weight / 100)} of your portfolio comes from that combined position.`,
      rows: topDuplicate.groupedSources.map(source => ({
          label: source.ticker,
          value: formatPercent(source.contribution)
        })).concat([{ label: 'Total exposure', value: formatPercent(topDuplicate.weight) }])
    });
  }

  const preferredOrder = {
    overlap: 5,
    duplication: 4,
    'top-company': 3,
    country: 2,
    sector: 1
  };
  return insights.sort((left, right) => right.score - left.score || preferredOrder[right.type] - preferredOrder[left.type])[0] || null;
}

function exposureInsightMarkup(snapshot, uniqueEstimate) {
  const insight = buildStandoutInsight(snapshot, state.portfolioValue);

  if (!snapshot.holdings.length || !insight) {
    return `<p class="insight-kicker">What stands out</p>
      <div class="insight-lead insight-lead-empty"><strong>${state.tickers.length}</strong><span><b>ETF mix analyzed</b><small>Exposure details are not available yet.</small></span></div>`;
  }

  return `<p class="insight-kicker">What stands out</p>
    <div class="insight-lead insight-lead-stacked">
      <strong>${insight.headline}</strong>
      <span><b>${insight.prefix}${insight.accent ? ` <em>${insight.accent}</em>` : ''}</b></span>
    </div>
    <p class="insight-secondary">${insight.secondary}</p>
    ${insightRowsMarkup(insight.rows)}`;
}

const builder = document.querySelector('#builder');
const builderFundList = builder.querySelector('.fund-list');
const addEtfButton = document.querySelector('#addEtf');
const addEtfMenu = document.querySelector('#addEtfMenu');
const comparePanel = builder.querySelector('#comparePanel');
const portfolioRoots = () => Array.from(document.querySelectorAll('[data-portfolio-root]'));
const minFunds = 1;
const defaultAddWeight = 10;
const compareState = { a: null, b: null };
let comparePanelOpen = false;
let addEtfMenuOpen = false;

function totalWeight(weights = state.weights) {
  return weights.reduce((sum, weight) => sum + weight, 0);
}

function buildFundCard(ticker, index) {
  const etf = etfs[ticker];
  const weight = state.weights[index] ?? 0;
  return `
    <article class="fund-card" data-index="${index}">
        <div class="fund-head">
          <div class="fund-head-copy">
            <span class="ticker">${ticker}</span>
            <span class="fund-name">${etf.name}</span>
          </div>
          <div class="fund-head-meta">
            <output>${Math.round(weight)}</output><span>%</span>
          <button type="button" class="remove" data-remove-index="${index}" aria-label="Remove ${ticker}">×</button>
          </div>
        </div>
      <input type="range" min="0" max="100" step="1" value="${Math.round(weight)}" aria-label="${ticker} allocation" />
    </article>
  `;
}

function normalizeWeightsFrom(activeIndex, activeValue) {
  const next = [...state.weights];
  const clamped = Math.max(0, Math.min(100, activeValue));
  next[activeIndex] = clamped;

  const otherIndices = next.map((_, index) => index).filter(index => index !== activeIndex);
  if (otherIndices.length === 0) return [100];

  const remaining = 100 - clamped;
  if (remaining <= 0) {
    otherIndices.forEach(index => { next[index] = 0; });
    return next;
  }

  const otherTotal = otherIndices.reduce((sum, index) => sum + (state.weights[index] || 0), 0);
  if (otherTotal > 0) {
    otherIndices.forEach(index => {
      next[index] = (state.weights[index] || 0) / otherTotal * remaining;
    });
    return next;
  }

  const evenShare = remaining / otherIndices.length;
  otherIndices.forEach(index => { next[index] = evenShare; });
  return next;
}

function renderBuilder() {
  builderFundList.innerHTML = state.tickers.map((ticker, index) => buildFundCard(ticker, index)).join('');
  syncBuilderUi();
  renderAddEtfMenu();
  renderComparePanel();
}

function availableTickers() {
  return Object.entries(etfs)
    .sort(([, left], [, right]) => left.name.localeCompare(right.name))
    .map(([ticker]) => ticker);
}

function renderAddEtfMenu() {
  if (!addEtfMenu) return;
  const available = availableTickers();
  addEtfMenu.hidden = !addEtfMenuOpen;
  if (!addEtfMenuOpen) return;

  if (!available.length) {
    addEtfMenu.innerHTML = '<p class="add-etf-empty">No more mock ETFs available.</p>';
    return;
  }

  addEtfMenu.innerHTML = `
    <div class="add-etf-heading">
      <p>All mock ETFs <span>${available.length}</span></p>
      <small>Scroll to see all</small>
    </div>
    <div class="add-etf-scroll" role="list">
      ${available.map(ticker => {
    const etf = etfs[ticker];
    const isSelected = state.tickers.includes(ticker);
    return `
        <button type="button" class="add-etf-option${isSelected ? ' is-selected' : ''}" data-add-ticker="${ticker}" title="${etf.name}" aria-label="${ticker} — ${etf.name}${isSelected ? ' — Added' : ' — Add ETF'}" role="listitem"${isSelected ? ' disabled' : ''}>
          <span>
            <strong>${ticker}</strong>
            <em>${etf.name}</em>
          </span>
          <small class="add-etf-detail">${etf.detail}</small>
          <small class="add-etf-status">${isSelected ? 'Added' : '+'}</small>
        </button>
      `;
    }).join('')}
    </div>
  `;
}

function toggleAddEtfMenu(forceOpen) {
  addEtfMenuOpen = typeof forceOpen === 'boolean' ? forceOpen : !addEtfMenuOpen;
  if (addEtfButton) addEtfButton.setAttribute('aria-expanded', String(addEtfMenuOpen));
  renderAddEtfMenu();
}

function syncBuilderUi() {
  document.querySelector('#homeTickerOne').textContent = state.tickers[0] || '—';
  document.querySelector('#homeTickerTwo').textContent = state.tickers[1] || '—';

  const cards = builderFundList.querySelectorAll('.fund-card');
  cards.forEach((card, index) => {
    const ticker = state.tickers[index];
    const etf = etfs[ticker];
    const weight = state.weights[index] ?? 0;
    card.dataset.index = index;
    const tickerEl = card.querySelector('.ticker');
    const nameEl = card.querySelector('.fund-name');
    const metaEl = card.querySelector('.fund-head-meta output');
    const metaUnitEl = card.querySelector('.fund-head-meta span');
    const outputEl = card.querySelector('output');
    const sliderEl = card.querySelector('input[type="range"]');
    const removeEl = card.querySelector('.remove');
    if (tickerEl) tickerEl.textContent = ticker;
    if (nameEl) nameEl.textContent = etf.name;
    if (metaEl) metaEl.value = Math.round(weight);
    if (metaUnitEl) metaUnitEl.textContent = '%';
    if (outputEl) outputEl.value = Math.round(weight);
    if (sliderEl) sliderEl.value = Math.round(weight);
    if (removeEl) {
      removeEl.dataset.removeIndex = index;
      removeEl.disabled = state.tickers.length <= minFunds;
    }
  });

  const combinedTotal = totalWeight();
  document.querySelector('#allocationTotal').textContent = `${formatPercent(combinedTotal)} allocated`;
  document.querySelector('#builder .allocation span').textContent = `${state.tickers.length} ETF${state.tickers.length === 1 ? '' : 's'}`;
  document.querySelector('#homeTickerOne').textContent = state.tickers[0] || '—';
  document.querySelector('#homeTickerTwo').textContent = state.tickers[1] || '—';
  document.querySelector('#homeVoo').innerHTML = `${Math.round(state.weights[0] || 0)}<sup>%</sup>`;
  document.querySelector('#homeXeqt').innerHTML = `${Math.round(state.weights[1] || 0)}<sup>%</sup>`;

  const meterBars = document.querySelectorAll('.mix-meter i');
  if (meterBars[0]) meterBars[0].style.width = `${state.weights[0] || 0}%`;
  if (meterBars[1]) meterBars[1].style.width = `${state.weights[1] || 0}%`;

  updateHomeInsights();
}

function addMockEtf(nextTicker) {
  const ticker = nextTicker || availableTickers()[0];
  if (!ticker) {
    alert('No more mock ETFs are available to add.');
    return;
  }
  if (state.tickers.includes(ticker)) {
    toggleAddEtfMenu(false);
    return;
  }

  const currentTotal = totalWeight() || 100;
  const scaledWeights = state.weights.map(weight => weight / currentTotal * (100 - defaultAddWeight));
  state.tickers = [...state.tickers, ticker];
  state.weights = [...scaledWeights, defaultAddWeight];
  toggleAddEtfMenu(false);
  renderBuilder();
  renderPortfolio();
}

function removeMockEtf(index) {
  if (state.tickers.length <= minFunds) {
    alert('Keep at least one ETF in the mix.');
    return;
  }
  if (!Number.isFinite(index) || index < 0 || index >= state.tickers.length) return;

  state.tickers.splice(index, 1);
  state.weights.splice(index, 1);
  const currentTotal = totalWeight() || 100;
  state.weights = state.weights.map(weight => weight / currentTotal * 100);
  renderBuilder();
  renderPortfolio();
}

function renderPortfolio() {
  const holdings = blendHoldings();
  const sectors = summarizePortfolioSectors(state.tickers, state.weights);
  const geography = summarizePortfolioGeography(state.tickers, state.weights);
  const uniqueEstimate = uniqueSecurityCount(state.tickers, holdings);
  const snapshot = { tickers: [...state.tickers], weights: [...state.weights], holdings, sectors, geography, uniqueEstimate };
  const missingSources = missingConstituentSources(state.tickers);
  const top = holdings.slice(0, 5);
  const overlapPair = state.tickers.length > 1
    ? calculateEtfOverlap(state.tickers[0], state.tickers[1])
    : null;
  const sectorTopThree = sectors.slice(0, 3).reduce((sum, [, weight]) => sum + weight, 0);
  const geographyTopThree = geography.slice(0, 3).reduce((sum, [, weight]) => sum + weight, 0);
  const topFiveExposure = top.reduce((sum, holding) => sum + holding.weight, 0);

  portfolioRoots().forEach(root => {
    root.querySelector('.portfolio-top span').textContent = root.dataset.portfolioLabel || 'True exposure';
    root.querySelector('.portfolio-top b').textContent = state.tickers.map((ticker, index) => `${ticker} ${Math.round(state.weights[index] || 0)}%`).join(' · ');
    const etfLabel = `${state.tickers.length} ETF${state.tickers.length === 1 ? '' : 's'}`;
    root.querySelector('.portfolio-title').innerHTML = `You bought ${etfLabel}.<br /><em>Here’s what’s inside.</em>`;
    root.querySelector('.securities-card').innerHTML = exposureInsightMarkup(snapshot, uniqueEstimate);
    const summary = root.querySelector('.securities-card-summary');
    if (summary) summary.innerHTML = portfolioInsightSummaryMarkup(snapshot);

    const missingMessage = missingSources.length
      ? `<p class="data-note">Underlying constituent data is not available for ${missingSources.join(', ')} yet. The issuer-reported security count is shown, but stock exposures are not estimated.</p>`
      : '';
    root.querySelector('.biggest-bets').innerHTML = `<p class="eyebrow">Top holdings</p><h2>The companies you own most</h2><p>Your combined exposure across all ETFs.</p>` +
      (top.length
          ? top.map((holding, index) => {
            return `<article class="holding-card${index === 0 ? ' featured' : ''}">${logoMarkup(holdingLogoTicker(holding), holding.name, 64)}<div><b>${holding.name}</b><span class="ticker">${holding.symbol}</span></div><strong>${holding.weight.toFixed(1)}<sup>%</sup></strong></article>`;
          }).join('') + `<p class="holding-summary">Your top ${top.length} holdings make up <b>${formatPercent(topFiveExposure)}</b> of your portfolio.</p>`
        : missingMessage);

    const overlapSection = root.querySelector('.overlap-summary');
    if (overlapSection) {
      overlapSection.hidden = !overlapPair?.sharedCount;
      if (overlapPair?.sharedCount) {
        const [tickerA, tickerB] = state.tickers;
        const qualifier = overlapPair.metricsComplete ? '' : 'At least ';
        overlapSection.innerHTML = `<p class="eyebrow">Overlap</p><h2>Your ETFs repeat holdings</h2><p>See how much of each fund shows up in the other.</p><div class="overlap-dashboard"><div class="overlap-stats"><span><strong>${qualifier}${formatPercent(overlapPair.totalOverlap)}</strong><small>Overlap<br />by weight</small></span><span><strong>${qualifier}${formatInteger(overlapPair.sharedCount)}</strong><small>Overlapping<br />holdings</small></span></div><div class="overlap-funds"><article><div><b>${tickerA}</b><span>${formatInteger(overlapPair.holdingsCountA)} holdings</span></div><strong>${formatPercent(overlapPair.shareOfHoldingsA)}</strong><small>also in ${tickerB}</small></article><article><div><b>${tickerB}</b><span>${formatInteger(overlapPair.holdingsCountB)} holdings</span></div><strong>${formatPercent(overlapPair.shareOfHoldingsB)}</strong><small>also in ${tickerA}</small></article></div>${overlapPair.metricsComplete ? '' : '<p class="overlap-caveat">Based on the constituent data currently available.</p>'}</div>`;
      }
    }

    const maxSector = sectors[0]?.[1] || 1;
    const sectorBars = root.querySelector('.sector-bars');
    if (sectorBars) {
      const visibleSectors = sectors.slice(0, 5);
      const visibleMaxSector = visibleSectors[0]?.[1] || maxSector;
      sectorBars.innerHTML = visibleSectors.length
        ? visibleSectors.map(([name, weight]) => `<div class="sector-bar"><div class="sector-head"><b>${name}</b><strong>${formatPercent(weight)}</strong></div><div class="sector-track"><i style="width:${weight / visibleMaxSector * 100}%"></i></div></div>`).join('') + `<div class="sector-note">Showing the top 5 sectors only. Smaller slices roll into Other. Top three = ${formatPercent(sectorTopThree)}.</div>`
        : `<div class="sector-note">Sector data is unavailable until the underlying ETF constituent holdings are loaded.</div>`;
    }

    const geoSection = root.querySelector('.geo-section');
    if (geoSection) {
      geoSection.innerHTML = `<p class="eyebrow">Geography</p><h2>Where in the world?</h2>` + geography.map(([region, weight]) => {
        const marker = geoMarker(region);
        return `<div class="geo-row"><span>${marker.kind === 'flag' ? `<i class="geo-flag" aria-hidden="true">${marker.symbol}</i>` : `<i class="geo-symbol">${marker.symbol}</i>`}${marker.label}</span><b>${formatPercent(weight)}</b></div>`;
      }).join('') + (geography.length
        ? `<div class="geo-note">Showing the top 3 geographies only. Smaller slices roll into Rest of world. Top three = ${formatPercent(geographyTopThree)}.</div>`
        : `<div class="geo-note">Geography data is unavailable until the underlying ETF constituent holdings are loaded.</div>`);
    }
  });
  renderComparePanel();
}

builder.addEventListener('input', event => {
  const slider = event.target.closest('input[type="range"]');
  if (!slider) return;
  const card = slider.closest('.fund-card');
  if (!card) return;
  const index = Number(card.dataset.index);
  state.weights = normalizeWeightsFrom(index, Number(slider.value));
  syncBuilderUi();
  renderPortfolio();
});

builder.addEventListener('click', event => {
  const removeButton = event.target.closest('[data-remove-index]');
  if (!removeButton) return;
  removeMockEtf(Number(removeButton.dataset.removeIndex));
});

builder.addEventListener('click', event => {
  const addTickerButton = event.target.closest('[data-add-ticker]');
  if (!addTickerButton) return;
  addMockEtf(addTickerButton.dataset.addTicker);
});

document.addEventListener('click', event => {
  const filterButton = event.target.closest('#explore .filters button');
  if (filterButton) {
    applyExploreFilter(filterButton.dataset.exploreFilter || 'all');
    return;
  }
});

document.addEventListener('click', event => {
  const editButton = event.target.closest('[data-edit-portfolio]');
  if (editButton) {
    const editor = editButton.closest('.securities-card-summary')?.querySelector('.portfolio-amount-editor');
    if (!editor) return;
    const willOpen = editor.hidden;
    document.querySelectorAll('.portfolio-amount-editor').forEach(item => { item.hidden = true; });
    document.querySelectorAll('[data-edit-portfolio]').forEach(item => item.setAttribute('aria-expanded', 'false'));
    editor.hidden = !willOpen;
    editButton.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) editor.querySelector('input')?.focus();
    return;
  }

  const presetButton = event.target.closest('[data-portfolio-amount]');
  if (!presetButton) return;
  state.portfolioValue = Number(presetButton.dataset.portfolioAmount);
  renderPortfolio();
});

document.addEventListener('submit', event => {
  const editor = event.target.closest('.portfolio-amount-editor');
  if (!editor) return;
  event.preventDefault();
  const amount = Number(new FormData(editor).get('portfolioAmount'));
  if (!Number.isFinite(amount) || amount < 1000) return;
  state.portfolioValue = Math.min(amount, 1000000000);
  renderPortfolio();
});

document.addEventListener('click', event => {
  const compareSave = event.target.closest('[data-compare-save]');
  if (compareSave) {
    compareState[compareSave.dataset.compareSave] = buildMixSnapshot();
    renderComparePanel();
    return;
  }

  const compareSwap = event.target.closest('[data-compare-swap]');
  if (!compareSwap || compareSwap.disabled) return;
  [compareState.a, compareState.b] = [compareState.b, compareState.a];
  renderComparePanel();
});

document.addEventListener('click', event => {
  const screenButton = event.target.closest('[data-screen]');
  if (screenButton?.dataset.screen === 'builder' && !event.target.closest('[data-action="compare"]')) {
    comparePanelOpen = false;
    renderComparePanel();
  }
  if (event.target.closest('#addEtf') || event.target.closest('#addEtfMenu')) return;
  if (addEtfMenuOpen) toggleAddEtfMenu(false);
});

addEtfButton.addEventListener('click', event => {
  event.preventDefault();
  toggleAddEtfMenu();
});
document.querySelector('#evenSplit').addEventListener('click', () => {
  const equalWeight = 100 / state.tickers.length;
  state.weights = state.tickers.map(() => equalWeight);
  syncBuilderUi();
  renderPortfolio();
});
document.querySelector('#compare').addEventListener('click', () => {
  comparePanelOpen = true;
  showScreen('builder');
  renderComparePanel();
  requestAnimationFrame(() => {
    comparePanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
renderPopularCombos();
renderHomeOverlaps();
renderExploreCombos();
applyExploreFilter(state.exploreFilter);
renderBuilder();
renderPortfolio();
