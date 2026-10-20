// Simulated price feed, standing in for the WebSocket until that deliverable.
// Every few seconds one company's price moves by up to 1.5% either way, and
// onQuote gets the new price. Returns a function that stops the feed.
export function startPriceFeed(prices, onQuote, everyMs = 2500) {
  const latest = { ...prices };
  const timer = setInterval(() => {
    const tickers = Object.keys(latest);
    const ticker = tickers[Math.floor(Math.random() * tickers.length)];
    const from = latest[ticker];
    const price = Math.round(from * (1 + (Math.random() - 0.5) * 0.03) * 100) / 100;
    latest[ticker] = price;
    onQuote({ ticker, from, price, time: new Date() });
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
