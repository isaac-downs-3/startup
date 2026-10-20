// Mocked service calls. Each one resolves to what its endpoint will return in
// the service deliverable, so only these function bodies change then.
import { metrics } from './metrics/metricsData';
import { rows } from './screener/screenerData';
import { tickers, setups } from './watchlist/watchlistData';

// GET /api/metrics: every metric and raw field definition.
export async function getMetrics() {
  return metrics;
}

// GET /api/screener: one row per company with every metric's value.
export async function getScreener() {
  return rows;
}

// GET /api/watchlist: the signed-in user's saved tickers and screener setups.
export async function getWatchlist() {
  return { tickers, setups };
}
