// The sample watchlist every new user starts with, served by getWatchlist() in service.js.
export const tickers = [
  { ticker: 'AAPL', added: '2025-05-02' },
  { ticker: 'AMD', added: '2025-05-02' },
  { ticker: 'AMZN', added: '2025-05-02' },
  { ticker: 'GOOGL', added: '2025-05-02' },
  { ticker: 'JPM', added: '2025-05-14' },
  { ticker: 'META', added: '2025-05-02' },
  { ticker: 'MSFT', added: '2025-05-02' },
  { ticker: 'NFLX', added: '2025-06-03' },
  { ticker: 'NVDA', added: '2025-05-02' },
  { ticker: 'TSLA', added: '2025-05-02' },
  { ticker: 'V', added: '2025-05-14' },
  { ticker: 'XOM', added: '2025-06-11' },
];

// Each saved setup holds the same fields as the screener's current setup.
export const setups = [
  {
    name: 'Profitability',
    setup: {
      columns: ['eps_ttm', 'net_margin', 'net_margin_pct', 'revenue_yoy', 'fcf_margin', 'pe', 'pe_pct'],
      sort: 'net_margin',
      order: 'desc',
      view: 'values',
    },
    lastUsed: '2025-06-30',
  },
  {
    name: 'Cheap vs own history',
    setup: { columns: ['net_margin_pct', 'pe', 'pe_pct'], sort: 'pe_pct', order: 'asc', view: 'ranks' },
    lastUsed: '2025-06-27',
  },
  {
    name: 'Balance sheet',
    setup: {
      columns: ['roe', 'debt_to_equity', 'dividend_yield', 'market_cap'],
      sort: 'debt_to_equity',
      order: 'asc',
      view: 'values',
    },
    lastUsed: '2025-06-18',
  },
];
