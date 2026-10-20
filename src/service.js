// Mocked service calls. Each one resolves to what its endpoint will return in
// the service deliverable, so only these function bodies change then.
import { metrics } from './metrics/metricsData';
import { rows } from './screener/screenerData';
import { tickers, setups } from './watchlist/watchlistData';

// GET /api/metrics: every metric and raw field definition.
export async function getMetrics() {
  return metrics;
}

// GET /api/screener: one row per company on the user's watchlist, with every
// metric's value. A ticker the sample data doesn't cover gets a row of dashes.
export async function getScreener(userName) {
  const { tickers } = await getWatchlist(userName);
  return tickers.map(({ ticker }) => rows.find((row) => row.ticker === ticker) ?? noSampleData(ticker));
}

function noSampleData(ticker) {
  const missing = { missing: 'No sample data for this ticker until Finnhub is connected' };
  const values = Object.fromEntries(Object.keys(rows[0].values).map((id) => [id, missing]));
  return { ticker, price: null, values };
}

// GET /api/watchlist: the signed-in user's saved tickers and screener setups.
// Until the database deliverable each user's watchlist is kept in localStorage,
// starting from the sample one.
export async function getWatchlist(userName) {
  const stored = localStorage.getItem(`watchlist.${userName}`);
  return stored ? JSON.parse(stored) : { tickers, setups };
}

// PUT /api/watchlist: replace the signed-in user's watchlist.
export async function saveWatchlist(userName, watchlist) {
  localStorage.setItem(`watchlist.${userName}`, JSON.stringify(watchlist));
  return watchlist;
}
