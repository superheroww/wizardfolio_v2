// ETF catalog with typed ETF metadata and legacy rows retained for compatibility.
// XEQT uses issuer-reported underlying ETF weights; child constituent files are added as available.
window.WIZARD_FOLIO_DATA.etfs = {
  "VOO": {
    "name": "Vanguard S&P 500 ETF",
    "detail": "🇺🇸 U.S. large cap",
    "holdingsCount": 503,
    "holdings": {
      "NVDA": [
        "NVIDIA",
        "🎮",
        7.6
      ],
      "AAPL": [
        "Apple",
        "🍎",
        7
      ],
      "MSFT": [
        "Microsoft",
        "🪟",
        5.4
      ],
      "AMZN": [
        "Amazon",
        "📦",
        4.1
      ],
      "GOOGL": [
        "Alphabet",
        "🔍",
        3.2
      ],
      "AVGO": [
        "Broadcom",
        "📡",
        2.9
      ],
      "META": [
        "Meta",
        "🌐",
        1.9
      ],
      "JPM": [
        "JPMorgan Chase",
        "🏦",
        1.5
      ]
    },
    "sectors": {
      "Technology": 33,
      "Consumer": 14,
      "Financials": 12,
      "Healthcare": 10,
      "Communication": 9,
      "Industrials": 10,
      "Energy": 4,
      "Other": 8
    },
    "geography": {
      "United States": 99.5,
      "Rest of world": 0.5
    }
  },
  "XEQT": {
    "name": "iShares Core Equity ETF Portfolio",
    "detail": "🌍 Global + 🍁 Canada tilt",
    "type": "etf",
    "currency": "CAD",
    "exchange": "TSX",
    "asOf": "Aug 14, 2026",
    "source": "BlackRock XEQT holdings CSV",
    "reportedUnderlyingHoldings": 8382,
    "holdings": [
      { "type": "etf", "ticker": "XTOT.TO", "name": "iShares Core S&P Total U.S. Stock Market Index ETF", "weight": 29.43 },
      { "type": "etf", "ticker": "XIC.TO", "name": "iShares S&P/TSX Capped Composite Index ETF", "weight": 25.64 },
      { "type": "etf", "ticker": "XEF.TO", "name": "iShares MSCI EAFE IMI Index ETF", "weight": 24.36 },
      { "type": "etf", "ticker": "ITOT", "name": "iShares Core S&P Total U.S. Stock Market ETF", "weight": 15.77 },
      { "type": "etf", "ticker": "XEC.TO", "name": "iShares MSCI Emerging Markets IMI Index ETF", "weight": 4.68 }
    ],
    "sectors": {
      "Technology": 24,
      "Consumer": 11,
      "Financials": 18,
      "Healthcare": 9,
      "Communication": 7,
      "Industrials": 12,
      "Energy": 7,
      "Other": 12
    },
    "geography": {
      "United States": 45,
      "Canada": 25,
      "Rest of world": 30
    }
  },
  "QQQ": {
    "name": "Invesco QQQ Trust",
    "detail": "⚡ Nasdaq-100 growth",
    "holdingsCount": 101,
    "holdings": {
      "AAPL": [
        "Apple",
        "🍎",
        8.7
      ],
      "MSFT": [
        "Microsoft",
        "🪟",
        8
      ],
      "NVDA": [
        "NVIDIA",
        "🎮",
        7.5
      ],
      "AMZN": [
        "Amazon",
        "📦",
        5.2
      ],
      "GOOGL": [
        "Alphabet",
        "🔍",
        5.1
      ],
      "META": [
        "Meta",
        "🌐",
        3.6
      ],
      "AVGO": [
        "Broadcom",
        "📡",
        4.2
      ],
      "TSLA": [
        "Tesla",
        "🚗",
        2.8
      ]
    },
    "sectors": {
      "Technology": 51,
      "Consumer": 18,
      "Financials": 0.5,
      "Healthcare": 6,
      "Communication": 16,
      "Industrials": 4,
      "Energy": 0.5,
      "Other": 4
    },
    "geography": {
      "United States": 97,
      "Rest of world": 3
    }
  },
  "VTI": {
    "name": "Vanguard Total Stock Market ETF",
    "detail": "🇺🇸 Total U.S. market",
    "holdingsCount": 3657,
    "holdings": {
      "AAPL": [
        "Apple",
        "🍎",
        6.1
      ],
      "MSFT": [
        "Microsoft",
        "🪟",
        5.7
      ],
      "NVDA": [
        "NVIDIA",
        "🎮",
        5.3
      ],
      "AMZN": [
        "Amazon",
        "📦",
        3.2
      ],
      "GOOGL": [
        "Alphabet",
        "🔍",
        3.5
      ],
      "META": [
        "Meta",
        "🌐",
        2.1
      ],
      "BRK": [
        "Berkshire Hathaway",
        "🏦",
        1.5
      ],
      "AVGO": [
        "Broadcom",
        "📡",
        1.5
      ]
    },
    "sectors": {
      "Technology": 31,
      "Consumer": 14,
      "Financials": 14,
      "Healthcare": 11,
      "Communication": 9,
      "Industrials": 9,
      "Energy": 4,
      "Other": 8
    },
    "geography": {
      "United States": 100
    }
  },
  "ITOT": {
    "name": "iShares Core S&P Total U.S. Stock Market ETF",
    "detail": "🇺🇸 U.S.-listed underlying ETF",
    "type": "etf",
    "currency": "USD",
    "exchange": "NYSE Arca",
    "asOf": "Aug 14, 2026",
    "source": "BlackRock XTOT aggregate underlying holdings CSV; normalized from XTOT 99.93% ITOT wrapper",
    "holdings": [],
    "sectors": {},
    "geography": {}
  },
  "VXUS": {
    "name": "Vanguard Total International Stock ETF",
    "detail": "🌍 Markets outside the U.S.",
    "holdingsCount": 8646,
    "holdings": {
      "TSM": [
        "Taiwan Semiconductor",
        "💾",
        2.2
      ],
      "SAP": [
        "SAP",
        "☁️",
        1.1
      ],
      "ASML": [
        "ASML",
        "🔬",
        1
      ],
      "TCEHY": [
        "Tencent",
        "💬",
        0.9
      ],
      "NVO": [
        "Novo Nordisk",
        "💊",
        0.8
      ],
      "NESN": [
        "Nestlé",
        "☕",
        0.8
      ],
      "RY": [
        "Royal Bank of Canada",
        "🍁",
        0.6
      ],
      "SHOP": [
        "Shopify",
        "🛍️",
        0.5
      ]
    },
    "sectors": {
      "Technology": 14,
      "Consumer": 13,
      "Financials": 22,
      "Healthcare": 10,
      "Communication": 6,
      "Industrials": 14,
      "Energy": 6,
      "Other": 15
    },
    "geography": {
      "Canada": 8,
      "Rest of world": 92
    }
  },
  "VDY": {
    "name": "Vanguard FTSE Canadian High Dividend Yield Index ETF",
    "detail": "🍁 Canadian dividend",
    "holdingsCount": 25,
    "holdings": {
      "RY": [
        "Royal Bank of Canada",
        "🍁",
        14.1
      ],
      "TD": [
        "Toronto-Dominion Bank",
        "🍁",
        9.8
      ],
      "ENB": [
        "Enbridge",
        "⛽",
        7.4
      ],
      "CNQ": [
        "Canadian Natural Resources",
        "🛢️",
        6.2
      ],
      "BMO": [
        "Bank of Montreal",
        "🏦",
        6
      ],
      "CM": [
        "Canadian Imperial Bank of Commerce",
        "🏦",
        5.5
      ],
      "BNS": [
        "Bank of Nova Scotia",
        "🏦",
        5.4
      ],
      "SU": [
        "Suncor Energy",
        "⛽",
        5
      ],
      "TRP": [
        "TC Energy",
        "🛢️",
        4.1
      ],
      "MFC": [
        "Manulife Financial",
        "🧾",
        3.6
      ],
      "NA": [
        "National Bank of Canada",
        "🏦",
        3.2
      ],
      "NTR": [
        "Nutrien",
        "🌾",
        2.3
      ],
      "CVE": [
        "Cenovus Energy",
        "⛽",
        2.2
      ],
      "SLF": [
        "Sun Life Financial",
        "🛡️",
        2.2
      ],
      "FTS": [
        "Fortis",
        "⚡",
        1.7
      ],
      "PPL": [
        "Pembina Pipeline",
        "🛢️",
        1.6
      ],
      "POW": [
        "Power Corp. of Canada",
        "🏛️",
        1.6
      ],
      "QSR": [
        "Restaurant Brands International",
        "🍔",
        1.6
      ],
      "BCE": [
        "BCE",
        "📶",
        1.5
      ],
      "T": [
        "TELUS",
        "📱",
        1.2
      ],
      "TOU": [
        "Tourmaline Oil",
        "🛢️",
        1.1
      ],
      "BAM": [
        "Brookfield Asset Management",
        "🏢",
        1
      ],
      "EMA": [
        "Emera",
        "⚡",
        1
      ],
      "MG": [
        "Magna International",
        "🚗",
        0.9
      ],
      "WCP": [
        "Whitecap Resources",
        "⛽",
        0.9
      ]
    },
    "sectors": {
      "Financials": 53.4,
      "Energy": 31.6,
      "Utilities": 5,
      "Telecommunications": 3.2,
      "Consumer Discretionary": 3,
      "Basic Materials": 2.5,
      "Technology": 0.4,
      "Consumer Staples": 0.3,
      "Health Care": 0.1,
      "Industrials": 0.1,
      "Other": 0.4
    },
    "geography": {
      "Canada": 100
    }
  },
  "SPY": {
    "name": "SPDR S&P 500 ETF Trust",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 10,
    "holdings": {
      "NVDA": [
        "NVIDIA Corporation",
        "•",
        7.57
      ],
      "AAPL": [
        "Apple Inc",
        "•",
        7.09
      ],
      "MSFT": [
        "Microsoft Corporation",
        "•",
        6.21
      ],
      "AMZN": [
        "Amazon.com Inc",
        "•",
        3.83
      ],
      "AVGO": [
        "Broadcom Inc",
        "•",
        3.22
      ],
      "GOOGL": [
        "Alphabet Inc Class A",
        "•",
        3.2
      ],
      "GOOG": [
        "Alphabet Inc Class C",
        "•",
        2.57
      ],
      "META": [
        "Meta Platforms Inc Class A",
        "•",
        2.37
      ],
      "TSLA": [
        "Tesla Inc",
        "•",
        2.06
      ],
      "BRK.B": [
        "Berkshire Hathaway Inc Class B",
        "•",
        1.61
      ]
    },
    "sectors": {
      "Information Technology": 24.09,
      "Consumer Discretionary": 5.890000000000001,
      "Communication Services": 8.14,
      "Financials": 1.61
    },
    "geography": {
      "United States": 39.73
    }
  },
  "SCHB": {
    "name": "Schwab U.S. Broad Market ETF",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "SCHD": {
    "name": "Schwab U.S. Dividend Equity ETF",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 10,
    "holdings": {
      "MRK": [
        "Merck and Co Inc",
        "•",
        4.98
      ],
      "AMGN": [
        "Amgen Inc",
        "•",
        4.86
      ],
      "CSCO": [
        "Cisco Systems Inc",
        "•",
        4.5
      ],
      "ABBV": [
        "AbbVie Inc",
        "•",
        4.3
      ],
      "KO": [
        "Coca-Cola Co",
        "•",
        4.23
      ],
      "BMY": [
        "Bristol Myers Squibb",
        "•",
        4.03
      ],
      "PEP": [
        "PepsiCo Inc",
        "•",
        3.99
      ],
      "CVX": [
        "Chevron Corp",
        "•",
        3.79
      ],
      "LMT": [
        "Lockheed Martin Corp",
        "•",
        3.76
      ],
      "VZ": [
        "Verizon Communications Inc",
        "•",
        3.74
      ]
    },
    "sectors": {
      "Health Care": 18.17,
      "Information Technology": 4.5,
      "Consumer Staples": 8.22,
      "Energy": 3.79,
      "Industrials": 3.76,
      "Communication Services": 3.74
    },
    "geography": {
      "United States": 42.18
    }
  },
  "SCHG": {
    "name": "Schwab U.S. Large-Cap Growth ETF",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "SCHX": {
    "name": "Schwab U.S. Large-Cap ETF",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "JEPQ": {
    "name": "JPMorgan Nasdaq Equity Premium Income ETF",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "JEPI": {
    "name": "JPMorgan Equity Premium Income ETF",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "VB": {
    "name": "Vanguard Small-Cap ETF",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "VBAL.TO": {
    "name": "Vanguard Balanced ETF Portfolio",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "VCN.TO": {
    "name": "Vanguard FTSE Canada All Cap Index ETF",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 10,
    "holdings": {
      "SHOP": [
        "Shopify Inc",
        "•",
        7.05799
      ],
      "RY": [
        "Royal Bank of Canada",
        "•",
        6.97955
      ],
      "TD": [
        "Toronto Dominion Bank/The",
        "•",
        4.74019
      ],
      "ENB": [
        "Enbridge Inc",
        "•",
        3.41782
      ],
      "BN": [
        "Brookfield Corp",
        "•",
        3.27559
      ],
      "BMO": [
        "Bank of Montreal",
        "•",
        3.00492
      ],
      "BNS": [
        "Bank of Nova Scotia/The",
        "•",
        2.75113
      ],
      "AEM": [
        "Agnico Eagle Mines Ltd",
        "•",
        2.69624
      ],
      "CM": [
        "Canadian Imperial Bank of Commerce",
        "•",
        2.61605
      ],
      "CP": [
        "Canadian Pacific Kansas City Ltd",
        "•",
        2.25961
      ]
    },
    "sectors": {
      "Information Technology": 7.05799,
      "Financials": 23.36743,
      "Energy": 3.41782,
      "Basic Materials": 2.69624,
      "Industrials": 2.25961
    },
    "geography": {
      "Canada": 38.79909
    }
  },
  "VCNS.TO": {
    "name": "Vanguard Conservative ETF Portfolio",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "VEA": {
    "name": "Vanguard FTSE Developed Markets ETF",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "VEE.TO": {
    "name": "Vanguard FTSE Emerging Markets All Cap Index ETF",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 10,
    "holdings": {
      "TSM": [
        "Taiwan Semiconductor Manufacturing Co Ltd",
        "•",
        10.65168
      ],
      "TCEHY": [
        "Tencent Holdings Ltd",
        "•",
        4.5676
      ],
      "BABA": [
        "Alibaba Group Holding Ltd",
        "•",
        3.45723
      ],
      "HDB": [
        "HDFC Bank Ltd",
        "•",
        1.14271
      ],
      "RELIANCE": [
        "Reliance Industries Ltd",
        "•",
        1.03406
      ],
      "PDD": [
        "PDD Holdings Inc",
        "•",
        0.93129
      ],
      "HONHAI": [
        "Hon Hai Precision Industry Co Ltd",
        "•",
        0.9166
      ],
      "XIAOMI": [
        "Xiaomi Corp",
        "•",
        0.86901
      ],
      "CCB": [
        "China Construction Bank Corp",
        "•",
        0.86689
      ],
      "ICICIBANK": [
        "ICICI Bank Ltd",
        "•",
        0.7249
      ]
    },
    "sectors": {
      "Information Technology": 17.06717,
      "Consumer Discretionary": 3.45723,
      "Financials": 2.7344999999999997,
      "Energy": 1.03406,
      "Communication Services": 0.86901
    },
    "geography": {
      "Taiwan": 11.568280000000001,
      "Hong Kong": 9.760729999999999,
      "India": 2.9016699999999997,
      "United States": 0.93129
    }
  },
  "VEQT.TO": {
    "name": "Vanguard All-Equity ETF Portfolio",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 4,
    "holdings": {
      "VUN.TO": [
        "Vanguard US Total Market Index ETF",
        "•",
        45.68
      ],
      "VCN.TO": [
        "Vanguard FTSE Canada All Cap Index ETF",
        "•",
        30.01
      ],
      "VIU.TO": [
        "Vanguard FTSE Developed All Cap ex North America Index ETF",
        "•",
        17.01
      ],
      "VEE.TO": [
        "Vanguard FTSE Emerging Markets All Cap Index ETF",
        "•",
        7.27
      ]
    },
    "sectors": {
      "Equity": 99.97
    },
    "geography": {
      "United States": 45.68,
      "Canada": 30.01,
      "International": 17.01,
      "Emerging Markets": 7.27
    }
  },
  "VFV.TO": {
    "name": "Vanguard S&P 500 Index ETF",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 10,
    "holdings": {
      "NVDA": [
        "NVIDIA Corp",
        "•",
        8.46097
      ],
      "AAPL": [
        "Apple Inc",
        "•",
        6.87108
      ],
      "MSFT": [
        "Microsoft Corp",
        "•",
        6.59133
      ],
      "AMZN": [
        "Amazon.com Inc",
        "•",
        4.05889
      ],
      "AVGO": [
        "Broadcom Inc",
        "•",
        2.97727
      ],
      "GOOGL": [
        "Alphabet Inc",
        "•",
        2.80108
      ],
      "META": [
        "Meta Platforms Inc",
        "•",
        2.40814
      ],
      "GOOG": [
        "Alphabet Inc",
        "•",
        2.25366
      ],
      "TSLA": [
        "Tesla Inc",
        "•",
        2.19397
      ],
      "BRK.B": [
        "Berkshire Hathaway Inc",
        "•",
        1.49958
      ]
    },
    "sectors": {
      "Information Technology": 24.90065,
      "Consumer Discretionary": 6.25286,
      "Communication Services": 7.46288,
      "Financials": 1.49958
    },
    "geography": {
      "United States": 40.115970000000004
    }
  },
  "VGRO.TO": {
    "name": "Vanguard Growth ETF Portfolio",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "VIU.TO": {
    "name": "Vanguard FTSE Developed All Cap ex North America Index ETF",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 10,
    "holdings": {
      "ASML": [
        "ASML Holding NV",
        "•",
        1.69645
      ],
      "SSNLF": [
        "Samsung Electronics Co Ltd",
        "•",
        1.43718
      ],
      "SAP": [
        "SAP SE",
        "•",
        1.08293
      ],
      "AZN": [
        "AstraZeneca PLC",
        "•",
        0.99845
      ],
      "HSBC": [
        "HSBC Holdings PLC",
        "•",
        0.98754
      ],
      "NSRGY": [
        "Nestle SA",
        "•",
        0.98438
      ],
      "NVS": [
        "Novartis AG",
        "•",
        0.93839
      ],
      "RHHBY": [
        "Roche Holding AG",
        "•",
        0.92214
      ],
      "SHEL": [
        "Shell PLC",
        "•",
        0.894
      ],
      "TM": [
        "Toyota Motor Corp",
        "•",
        0.88006
      ]
    },
    "sectors": {
      "Information Technology": 2.7793799999999997,
      "Communication Services": 1.43718,
      "Health Care": 2.85898,
      "Financials": 0.98754,
      "Consumer Staples": 0.98438,
      "Energy": 0.894,
      "Consumer Discretionary": 0.88006
    },
    "geography": {
      "Netherlands": 1.69645,
      "South Korea": 1.43718,
      "Germany": 1.08293,
      "United Kingdom": 2.87999,
      "Switzerland": 2.8449099999999996,
      "Japan": 0.88006
    }
  },
  "VO": {
    "name": "Vanguard Mid-Cap ETF",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "VT": {
    "name": "Vanguard Total World Stock ETF",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "VUN.TO": {
    "name": "Vanguard U.S. Total Market Index ETF",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 10,
    "holdings": {
      "NVDA": [
        "NVIDIA Corp",
        "•",
        7.13171
      ],
      "AAPL": [
        "Apple Inc",
        "•",
        6.1216
      ],
      "MSFT": [
        "Microsoft Corp",
        "•",
        5.87224
      ],
      "AMZN": [
        "Amazon.com Inc",
        "•",
        3.57636
      ],
      "AVGO": [
        "Broadcom Inc",
        "•",
        2.65247
      ],
      "GOOGL": [
        "Alphabet Inc",
        "•",
        2.49496
      ],
      "META": [
        "Meta Platforms Inc",
        "•",
        2.14547
      ],
      "GOOG": [
        "Alphabet Inc",
        "•",
        1.98508
      ],
      "TSLA": [
        "Tesla Inc",
        "•",
        1.90974
      ],
      "BRK.B": [
        "Berkshire Hathaway Inc",
        "•",
        1.30516
      ]
    },
    "sectors": {
      "Technology": 28.403529999999996,
      "Consumer Discretionary": 5.4861,
      "Financials": 1.30516
    },
    "geography": {
      "United States": 35.19479
    }
  },
  "VWO": {
    "name": "Vanguard FTSE Emerging Markets ETF",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "XAW.TO": {
    "name": "iShares Core MSCI All Country World ex Canada Index ETF",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 8,
    "holdings": {
      "IVV": [
        "iShares Core S&P 500 ETF",
        "•",
        52.69
      ],
      "XEF": [
        "iShares MSCI EAFE IMI Index ETF",
        "•",
        22.89
      ],
      "XEC": [
        "iShares MSCI Emerging Markets IMI Index ETF",
        "•",
        11.98
      ],
      "ITOT": [
        "iShares Core S&P Total US Stock Market ETF",
        "•",
        7.36
      ],
      "IJH": [
        "iShares Core S&P Mid Cap ETF",
        "•",
        3.21
      ],
      "IJR": [
        "iShares Core S&P Small Cap ETF",
        "•",
        1.82
      ],
      "USD": [
        "USD Cash",
        "•",
        0.04
      ],
      "CAD": [
        "CAD Cash",
        "•",
        0.02
      ]
    },
    "sectors": {
      "Equity": 99.94999999999999,
      "Cash": 0.06
    },
    "geography": {
      "United States": 65.12,
      "International": 22.89,
      "Emerging Markets": 11.98,
      "Canada": 0.02
    }
  },
  "XEC.TO": {
    "name": "iShares Core MSCI Emerging Markets IMI Index ETF",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 2986,
    "asOf": "Aug 14, 2026",
    "source": "BlackRock XEC holdings CSV",
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "XEF.TO": {
    "name": "iShares Core MSCI EAFE IMI Index ETF",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 2511,
    "asOf": "Aug 14, 2026",
    "source": "BlackRock XEF holdings CSV",
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "XIC.TO": {
    "name": "iShares Core S&P/TSX Capped Composite Index ETF",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 219,
    "asOf": "Aug 14, 2026",
    "source": "BlackRock XIC holdings CSV",
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "XTOT.TO": {
    "name": "iShares Core S&P Total U.S. Stock Market Index ETF",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 1,
    "asOf": "Aug 14, 2026",
    "source": "BlackRock XTOT holdings CSV",
    "holdings": {},
    "sectors": {},
    "geography": {}
  },
  "XUU.TO": {
    "name": "iShares Core S&P U.S. Total Market Index ETF",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 10,
    "holdings": {
      "ITOT": [
        "ISHARES CORE S&P TOTAL U.S. STOCK",
        "•",
        47.25
      ],
      "IVV": [
        "ISHARES CORE S&P ETF TRUST",
        "•",
        46.87
      ],
      "IJH": [
        "ISHARES CORE S&P MID-CAP ETF",
        "•",
        2.45
      ],
      "IJR": [
        "ISHARES CORE S&P SMALL-CAP ETF",
        "•",
        0.95
      ],
      "CRH": [
        "CRH PUBLIC LIMITED PLC",
        "•",
        0.13
      ],
      "UBER": [
        "UBER TECHNOLOGIES INC",
        "•",
        0.09
      ],
      "PANW": [
        "PALO ALTO NETWORKS INC",
        "•",
        0.09
      ],
      "CRWD": [
        "CROWDSTRIKE HOLDINGS INC CLASS A",
        "•",
        0.09
      ],
      "AVGO": [
        "BROADCOM INC",
        "•",
        0.08
      ],
      "FERG": [
        "FERGUSON ENTERPRISES INC",
        "•",
        0.08
      ]
    },
    "sectors": {
      "Equity": 98.08000000000001
    },
    "geography": {
      "": 98.08000000000001
    }
  },
  "ZSP.TO": {
    "name": "BMO S&P 500 Index ETF",
    "detail": "🇨🇦 Canadian-listed ETF",
    "holdingsCount": 10,
    "holdings": {
      "NVDA": [
        "NVIDIA Corporation",
        "•",
        7.58
      ],
      "AAPL": [
        "Apple Inc",
        "•",
        7.09
      ],
      "MSFT": [
        "Microsoft Corporation",
        "•",
        6.21
      ],
      "AMZN": [
        "Amazon.com Inc",
        "•",
        3.84
      ],
      "AVGO": [
        "Broadcom Inc",
        "•",
        3.21
      ],
      "GOOGL": [
        "Alphabet Inc Class A",
        "•",
        3.2
      ],
      "GOOG": [
        "Alphabet Inc Class C",
        "•",
        2.57
      ],
      "META": [
        "Meta Platforms Inc",
        "•",
        2.36
      ],
      "TSLA": [
        "Tesla Inc",
        "•",
        2.06
      ],
      "BRK.B": [
        "Berkshire Hathaway Inc Class B",
        "•",
        1.61
      ]
    },
    "sectors": {
      "Information Technology": 24.09,
      "Consumer Discretionary": 5.9,
      "Communication Services": 8.129999999999999,
      "Financials": 1.61
    },
    "geography": {
      "United States": 39.73
    }
  },
  "QQQM": {
    "name": "Invesco NASDAQ 100 ETF",
    "detail": "🇺🇸 U.S.-listed ETF",
    "holdingsCount": 0,
    "holdings": {},
    "sectors": {},
    "geography": {}
  }
};
