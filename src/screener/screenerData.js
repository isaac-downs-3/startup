// Sample screener results as of the 2025-06-30 close. Later these come from
// GET /api/screener. A value of { missing: reason } could not be computed.
export const columns = [
  { id: 'eps_ttm', unit: 'currency per share' },
  { id: 'net_margin', unit: 'ratio' },
  { id: 'net_margin_pct', unit: 'percentile' },
  { id: 'revenue_yoy', unit: 'ratio' },
  { id: 'fcf_margin', unit: 'ratio' },
  { id: 'pe', unit: 'multiple' },
  { id: 'pe_pct', unit: 'percentile' },
];

const noFcf = { missing: 'Not defined for banks: no free cash flow line in the financials' };
const shortHistory = { missing: 'Needs 20 quarters of history; 12 available' };

export const rows = [
  { ticker: 'NVDA', values: ['$2.94', '55.8%', '0.99', '69.2%', '44.1%', '42.1×', '0.35'] },
  { ticker: 'V', values: ['$10.70', '54.2%', '0.88', '10.1%', '51.3%', '31.4×', '0.62'] },
  { ticker: 'META', values: ['$23.86', '38.3%', '0.97', '21.9%', '30.2%', '26.0×', '0.41'] },
  { ticker: 'MSFT', values: ['$13.64', '35.8%', '0.93', '15.0%', '27.1%', '36.2×', '0.81'] },
  { ticker: 'GOOGL', values: ['$8.94', '31.1%', '0.95', '13.6%', '20.4%', '22.7×', '0.28'] },
  { ticker: 'NFLX', values: ['$19.83', '24.6%', '0.99', '15.4%', '19.6%', '48.3×', '0.44'] },
  { ticker: 'AAPL', values: ['$6.59', '24.3%', '0.71', '4.9%', '26.1%', '34.8×', '0.90'] },
  { ticker: 'JPM', values: ['$19.75', '21.9%', '0.79', '12.3%', noFcf, '12.9×', '0.74'] },
  { ticker: 'AMZN', values: ['$5.53', '10.1%', '0.98', '10.9%', '2.9%', '38.9×', '0.12'] },
  { ticker: 'XOM', values: ['$7.84', '9.9%', '0.46', '-2.6%', '9.1%', '14.2×', '0.55'] },
  { ticker: 'AMD', values: ['$1.00', '8.0%', shortHistory, '24.8%', '8.7%', '130.5×', shortHistory] },
  { ticker: 'TSLA', values: ['$1.66', '6.4%', '0.21', '-2.7%', '3.8%', '210.6×', '0.96'] },
];

// WebSocket placeholder: later these are pushed from the server as prices move.
export const liveUpdates = [
  { time: '10:42:07', kind: 'up', text: 'NVDA price $123.54 → $124.71: Price / earnings 42.1× → 42.4×' },
  { time: '10:41:52', kind: 'down', text: 'TSLA price $349.62 → $346.10: Price / earnings 210.6× → 208.5×' },
  { time: '10:41:30', kind: 'up', text: 'AMZN price $215.11 → $216.02: Price / earnings 38.9× → 39.1×' },
  { time: '10:40:58', kind: 'news', text: 'AMD reported: Net margin percentile now available' },
];
