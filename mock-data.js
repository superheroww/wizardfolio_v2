// Deliberately small, approximate fixtures for product prototyping.
// Percentages are weights within each ETF, not live market data.
const comboDefinitions = [
  {
    id: 'core',
    preset: 'core',
    tickers: ['VOO', 'XEQT'],
    weights: [60, 40],
    icon: '🇺🇸🇨🇦',
    badge: 'Most popular',
    title: 'Core',
    pair: 'VOO + XEQT',
    allocation: '60 / 40',
    note: 'Apple shows up through both ETFs.',
    background: 'linear-gradient(135deg, #2563eb, #3b82f6)'
  },
  {
    id: 'growth',
    preset: 'growth',
    tickers: ['VOO', 'QQQ'],
    weights: [70, 30],
    icon: '⚡',
    badge: 'Spicy',
    title: 'Growth',
    pair: 'VOO + QQQ',
    allocation: '70 / 30',
    note: 'Technology becomes nearly half.',
    background: 'linear-gradient(150deg, #0b1220 0%, #111c2e 45%, #1e3a8a 100%)'
  },
  {
    id: 'world',
    preset: 'world',
    tickers: ['VTI', 'VXUS'],
    weights: [70, 30],
    icon: '🌎',
    badge: 'Balanced world',
    title: 'Global',
    pair: 'VTI + VXUS',
    allocation: '70 / 30',
    note: 'Less U.S. exposure, still big tech.',
    background: 'linear-gradient(135deg, #16a34a, #22c55e)'
  },
  {
    id: 'canada-income',
    preset: 'canada-income',
    tickers: ['VDY', 'XEQT'],
    weights: [20, 80],
    title: 'Canada income',
    pair: 'VDY.TO + XEQT.TO',
    allocation: '20 / 80',
    icon: '🍁',
    badge: 'Income + core',
    note: 'Dividend tilt with global diversification.',
    background: 'linear-gradient(135deg, #7c3aed, #16a34a)'
  },
  {
    id: 'three-way',
    title: 'Three-way blend',
    pair: 'VDY.TO + XEQT.TO + VOO',
    allocation: '10 / 45 / 45',
    icon: '🍁🇺🇸',
    badge: 'Experimental',
    note: 'Preview only until the builder supports three funds.',
    action: 'preview-three-way',
    background: 'linear-gradient(135deg, #0f172a, #1d4ed8 55%, #16a34a)'
  }
];

const popularCombos = comboDefinitions.map(({ tickers, weights, ...combo }) => combo);
const presets = Object.fromEntries(comboDefinitions.filter(combo => combo.preset && combo.tickers && combo.weights).map(combo => [combo.preset, { tickers: combo.tickers, weights: combo.weights }]));
const homeOverlapPairs = [
  { pair: ['SPY', 'QQQ'], note: 'Two mega-cap funds, one huge shared top holding.' },
  { pair: ['XEQT', 'VDY'], note: 'Canada exposure piles into the same bank leader.' },
  { pair: ['VTI', 'QQQ'], note: 'Total market plus growth still leans on the same names.' },
  { pair: ['VXUS', 'VDY'], note: 'International plus Canada income still circles back to one bank.' },
  { pair: ['SPY', 'VTI'], note: 'Broad U.S. funds often overlap more than expected.' },
  { pair: ['VOO', 'VTI'], note: 'S&P 500 and total market share the same top names.' },
  { pair: ['QQQ', 'XEQT'], note: 'Global diversification still inherits big U.S. tech.' },
  { pair: ['VOO', 'XEQT'], note: 'A core U.S. fund and a global core still meet in AI.' },
  { pair: ['SPY', 'XEQT'], note: 'Even a world ETF keeps the same mega-caps near the top.' },
  { pair: ['VTI', 'XEQT'], note: 'Global plus total market still repeats the same leaders.' }
];

window.WIZARD_FOLIO_DATA = {
  portfolioValue: 10000,
  etfs: {
    VOO: {
      name: 'Vanguard S&P 500 ETF',
      detail: '🇺🇸 U.S. large cap',
      holdingsCount: 503,
      holdings: {
        NVDA: ['NVIDIA', '🎮', 7.6],
        AAPL: ['Apple', '🍎', 7.0],
        MSFT: ['Microsoft', '🪟', 5.4],
        AMZN: ['Amazon', '📦', 4.1],
        GOOGL: ['Alphabet', '🔍', 3.2],
        AVGO: ['Broadcom', '📡', 2.9],
        META: ['Meta', '🌐', 1.9],
        JPM: ['JPMorgan Chase', '🏦', 1.5]
      },
      sectors: { Technology: 33.0, Consumer: 14.0, Financials: 12.0, Healthcare: 10.0, Communication: 9.0, Industrials: 10.0, Energy: 4.0, Other: 8.0 },
      geography: { 'United States': 99.5, 'Rest of world': 0.5 }
    },
    QQQ: {
      name: 'Invesco QQQ Trust', detail: '⚡ Nasdaq-100 growth', holdingsCount: 101,
      holdings: { AAPL: ['Apple', '🍎', 8.7], MSFT: ['Microsoft', '🪟', 8.0], NVDA: ['NVIDIA', '🎮', 7.5], AMZN: ['Amazon', '📦', 5.2], GOOGL: ['Alphabet', '🔍', 5.1], META: ['Meta', '🌐', 3.6], AVGO: ['Broadcom', '📡', 4.2], TSLA: ['Tesla', '🚗', 2.8] },
      sectors: { Technology: 51.0, Consumer: 18.0, Financials: 0.5, Healthcare: 6.0, Communication: 16.0, Industrials: 4.0, Energy: 0.5, Other: 4.0 },
      geography: { 'United States': 97, 'Rest of world': 3 }
    },
    VTI: {
      name: 'Vanguard Total Stock Market ETF', detail: '🇺🇸 Total U.S. market', holdingsCount: 3657,
      holdings: { AAPL: ['Apple', '🍎', 6.1], MSFT: ['Microsoft', '🪟', 5.7], NVDA: ['NVIDIA', '🎮', 5.3], AMZN: ['Amazon', '📦', 3.2], GOOGL: ['Alphabet', '🔍', 3.5], META: ['Meta', '🌐', 2.1], BRK: ['Berkshire Hathaway', '🏦', 1.5], AVGO: ['Broadcom', '📡', 1.5] },
      sectors: { Technology: 31.0, Consumer: 14.0, Financials: 14.0, Healthcare: 11.0, Communication: 9.0, Industrials: 9.0, Energy: 4.0, Other: 8.0 },
      geography: { 'United States': 100 }
    },
    VXUS: {
      name: 'Vanguard Total International Stock ETF', detail: '🌍 Markets outside the U.S.', holdingsCount: 8646,
      holdings: { TSM: ['Taiwan Semiconductor', '💾', 2.2], SAP: ['SAP', '☁️', 1.1], ASML: ['ASML', '🔬', 1.0], TCEHY: ['Tencent', '💬', 0.9], NVO: ['Novo Nordisk', '💊', 0.8], NESN: ['Nestlé', '☕', 0.8], RY: ['Royal Bank of Canada', '🍁', 0.6], SHOP: ['Shopify', '🛍️', 0.5] },
      sectors: { Technology: 14.0, Consumer: 13.0, Financials: 22.0, Healthcare: 10.0, Communication: 6.0, Industrials: 14.0, Energy: 6.0, Other: 15.0 },
      geography: { Canada: 8, 'Rest of world': 92 }
    },
    VDY: {
      name: 'Vanguard FTSE Canadian High Dividend Yield Index ETF',
      detail: '🍁 Canadian dividend',
      holdingsCount: 25,
      holdings: {
        RY: ['Royal Bank of Canada', '🍁', 14.1],
        TD: ['Toronto-Dominion Bank', '🍁', 9.8],
        ENB: ['Enbridge', '⛽', 7.4],
        CNQ: ['Canadian Natural Resources', '🛢️', 6.2],
        BMO: ['Bank of Montreal', '🏦', 6.0],
        CM: ['Canadian Imperial Bank of Commerce', '🏦', 5.5],
        BNS: ['Bank of Nova Scotia', '🏦', 5.4],
        SU: ['Suncor Energy', '⛽', 5.0],
        TRP: ['TC Energy', '🛢️', 4.1],
        MFC: ['Manulife Financial', '🧾', 3.6],
        NA: ['National Bank of Canada', '🏦', 3.2],
        NTR: ['Nutrien', '🌾', 2.3],
        CVE: ['Cenovus Energy', '⛽', 2.2],
        SLF: ['Sun Life Financial', '🛡️', 2.2],
        FTS: ['Fortis', '⚡', 1.7],
        PPL: ['Pembina Pipeline', '🛢️', 1.6],
        POW: ['Power Corp. of Canada', '🏛️', 1.6],
        QSR: ['Restaurant Brands International', '🍔', 1.6],
        BCE: ['BCE', '📶', 1.5],
        T: ['TELUS', '📱', 1.2],
        TOU: ['Tourmaline Oil', '🛢️', 1.1],
        BAM: ['Brookfield Asset Management', '🏢', 1.0],
        EMA: ['Emera', '⚡', 1.0],
        MG: ['Magna International', '🚗', 0.9],
        WCP: ['Whitecap Resources', '⛽', 0.9]
      },
      sectors: {
        Financials: 53.4,
        Energy: 31.6,
        Utilities: 5.0,
        Telecommunications: 3.2,
        'Consumer Discretionary': 3.0,
        'Basic Materials': 2.5,
        Technology: 0.4,
        'Consumer Staples': 0.3,
        'Health Care': 0.1,
        Industrials: 0.1,
        Other: 0.4
      },
      geography: { Canada: 100 }
    }
  },
  popularCombos,
  homeOverlapPairs,
  presets,
  comboDefinitions
};
