# wizardFolio

An ETF look-through tool: enter one or more ETFs to see the underlying company exposure, overlap, sector mix, and portfolio concentration.

## Intended experience

- Search and add ETF tickers
- Look through fund holdings to aggregated company exposure
- Compare ETF overlap and duplicated positions
- Explore sector, geography, and top-holding concentration

## Status

The browser still runs from local catalog data, but look-through calculations now use
typed ETF/stock rows and recursively flatten ETF-to-ETF holdings. `mock-data.js` owns
presets and display combinations; `etf-catalog.js` owns ETF metadata and holdings.

The catalog includes legacy sample rows for several funds and issuer-sourced metadata
for XEQT. XEQT's underlying child ETFs are populated by `ishares-holdings.js`, a
generated fixture from BlackRock holdings CSVs. `reportedUnderlyingHoldings` remains
issuer-reported metadata and is used only as a fallback when a fund does not have
complete flattened constituent data. Popular combinations and presets come from one
combo definition list in `mock-data.js`, so cards and click-through mix presets stay in
sync.

The same fixture file also defines `popularCombos`, which drives the home-screen
"Popular combinations" rail. Each card includes the preset key plus display copy,
so you can add or reorder combinations without editing the HTML.

Legacy fixture values remain illustrative and must not be presented as live or
investment-grade data. A future API adapter can replace `window.WIZARD_FOLIO_DATA` while
preserving the typed ETF object shape.
