import { formatValue } from './format';

// Simulated price feed, standing in for the WebSocket until that deliverable.
// Every few seconds one company's price moves by up to 1.5% either way, and
// onQuote gets the new price. Returns a function that stops the feed.
export function startPriceFeed(prices, onQuote, everyMs = 2500) {
  const latest = { ...prices };
  const timer = setInterval(() => {
    const tickers = Object.keys(latest);
    const ticker = tickers[Math.floor(Math.random() * tickers.length)];
    const price = Math.round(latest[ticker] * (1 + (Math.random() - 0.5) * 0.03) * 100) / 100;
    latest[ticker] = price;
    onQuote({ ticker, price, time: new Date() });
  }, everyMs);
  return () => clearInterval(timer);
}

// The metrics computed from price, and how each one changes when the price is
// multiplied by `ratio`. Their formulas are on the Metrics page. P/E percentile
// also reads price, but it needs quarter-end history the sample data doesn't
// have, so it keeps its sampled value.
const priceDriven = {
  pe: (value, ratio) => value * ratio, // price ÷ eps_ttm
  market_cap: (value, ratio) => value * ratio, // price × sharesOutstanding
  dividend_yield: (value, ratio) => value / ratio, // dividendsPerShare ÷ price
};

// A copy of the row at the new price, with its price-driven metrics recomputed.
// A missing value stays missing.
export function repriceRow(row, price) {
  const ratio = price / row.price;
  const values = { ...row.values };
  for (const [id, move] of Object.entries(priceDriven)) {
    if (typeof values[id] === 'number') values[id] = move(values[id], ratio);
  }
  return { ...row, price, values };
}

// One entry for the Live updates list: the price move, what it did to P/E, and
// which metrics changed, so the table can flash those cells.
let nextId = 0;
export function describeMove(before, after, time) {
  const change = after.price / before.price - 1;
  const price = (row) => formatValue(row.price, 'currency per share');
  const pe = (row) => formatValue(row.values.pe, 'multiple');
  const peText = typeof before.values.pe === 'number' ? `: Price / earnings ${pe(before)} → ${pe(after)}` : '';
  return {
    id: nextId++,
    time: time.toLocaleTimeString('en-US', { hour12: false }),
    kind: change < 0 ? 'down' : 'up',
    ticker: after.ticker,
    changed: Object.keys(after.values).filter((id) => after.values[id] !== before.values[id]),
    text: `${after.ticker} price ${price(before)} → ${price(after)} (${change < 0 ? '' : '+'}${(change * 100).toFixed(1)}%)${peText}`,
  };
}
