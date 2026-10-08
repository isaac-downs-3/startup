// Database placeholder: later these come from GET /api/watchlist for the signed-in user.
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

export const setups = [
  {
    name: 'Profitability',
    columns: 'EPS TTM, Net margin, Net margin pct, Revenue YoY, FCF margin, P/E, P/E pct',
    sortedBy: 'Net margin, high to low',
    view: 'Values',
    lastUsed: '2025-06-30',
  },
  {
    name: 'Cheap vs own history',
    columns: 'P/E, P/E pct, Net margin pct',
    sortedBy: 'P/E pct, low to high',
    view: 'Ranks',
    lastUsed: '2025-06-27',
  },
  {
    name: 'Balance sheet',
    columns: 'Debt / equity, Return on equity, Dividend yield, Market cap',
    sortedBy: 'Debt / equity, low to high',
    view: 'Values',
    lastUsed: '2025-06-18',
  },
];
