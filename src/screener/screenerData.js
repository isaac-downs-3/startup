// Sample screener results as of the 2025-06-30 close. Later these come from
// GET /api/screener. A value of { missing: reason } could not be computed.
export const columns = ['eps_ttm', 'net_margin', 'net_margin_pct', 'revenue_yoy', 'fcf_margin', 'pe', 'pe_pct'];

const noFcf = { missing: 'Not defined for banks: no free cash flow line in the financials' };
const shortHistory = { missing: 'Needs 20 quarters of history; 12 available' };

// Values are keyed by metric id and stored as plain numbers in the metric's unit.
export const rows = [
  { ticker: 'NVDA', values: { eps_ttm: 2.94, net_margin: 0.558, net_margin_pct: 0.99, revenue_yoy: 0.692, fcf_margin: 0.441, pe: 42.1, pe_pct: 0.35 } },
  { ticker: 'V', values: { eps_ttm: 10.7, net_margin: 0.542, net_margin_pct: 0.88, revenue_yoy: 0.101, fcf_margin: 0.513, pe: 31.4, pe_pct: 0.62 } },
  { ticker: 'META', values: { eps_ttm: 23.86, net_margin: 0.383, net_margin_pct: 0.97, revenue_yoy: 0.219, fcf_margin: 0.302, pe: 26.0, pe_pct: 0.41 } },
  { ticker: 'MSFT', values: { eps_ttm: 13.64, net_margin: 0.358, net_margin_pct: 0.93, revenue_yoy: 0.15, fcf_margin: 0.271, pe: 36.2, pe_pct: 0.81 } },
  { ticker: 'GOOGL', values: { eps_ttm: 8.94, net_margin: 0.311, net_margin_pct: 0.95, revenue_yoy: 0.136, fcf_margin: 0.204, pe: 22.7, pe_pct: 0.28 } },
  { ticker: 'NFLX', values: { eps_ttm: 19.83, net_margin: 0.246, net_margin_pct: 0.99, revenue_yoy: 0.154, fcf_margin: 0.196, pe: 48.3, pe_pct: 0.44 } },
  { ticker: 'AAPL', values: { eps_ttm: 6.59, net_margin: 0.243, net_margin_pct: 0.71, revenue_yoy: 0.049, fcf_margin: 0.261, pe: 34.8, pe_pct: 0.9 } },
  { ticker: 'JPM', values: { eps_ttm: 19.75, net_margin: 0.219, net_margin_pct: 0.79, revenue_yoy: 0.123, fcf_margin: noFcf, pe: 12.9, pe_pct: 0.74 } },
  { ticker: 'AMZN', values: { eps_ttm: 5.53, net_margin: 0.101, net_margin_pct: 0.98, revenue_yoy: 0.109, fcf_margin: 0.029, pe: 38.9, pe_pct: 0.12 } },
  { ticker: 'XOM', values: { eps_ttm: 7.84, net_margin: 0.099, net_margin_pct: 0.46, revenue_yoy: -0.026, fcf_margin: 0.091, pe: 14.2, pe_pct: 0.55 } },
  { ticker: 'AMD', values: { eps_ttm: 1.0, net_margin: 0.08, net_margin_pct: shortHistory, revenue_yoy: 0.248, fcf_margin: 0.087, pe: 130.5, pe_pct: shortHistory } },
  { ticker: 'TSLA', values: { eps_ttm: 1.66, net_margin: 0.064, net_margin_pct: 0.21, revenue_yoy: -0.027, fcf_margin: 0.038, pe: 210.6, pe_pct: 0.96 } },
];

// WebSocket placeholder: later these are pushed from the server as prices move.
export const liveUpdates = [
  { time: '10:42:07', kind: 'up', text: 'NVDA price $123.54 → $124.71: Price / earnings 42.1× → 42.4×' },
  { time: '10:41:52', kind: 'down', text: 'TSLA price $349.62 → $346.10: Price / earnings 210.6× → 208.5×' },
  { time: '10:41:30', kind: 'up', text: 'AMZN price $215.11 → $216.02: Price / earnings 38.9× → 39.1×' },
  { time: '10:40:58', kind: 'news', text: 'AMD reported: Net margin percentile now available' },
];
