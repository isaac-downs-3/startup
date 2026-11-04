// Calls to the backend service. The cookie that identifies the user is set by the
// service and sent by the browser, so it never appears in this code.
import { rows } from './screener/screenerData';
import { tickers, setups } from './watchlist/watchlistData';

let onSignedOut = () => {};

// App registers what to do when the service says the session is no longer valid,
// such as after a restart, which loses the in-memory sessions.
export function setSignedOutHandler(handler) {
  onSignedOut = handler;
}

// Resolves to the parsed response, or rejects with a message fit to show the user.
async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the service. Check your connection and try again.");
  }
  if (response.status === 401) onSignedOut();
  if (!response.ok) {
    const { msg } = await response.json().catch(() => ({}));
    throw new Error(msg ?? 'Something went wrong. Try again.');
  }
  return response.status === 204 ? null : response.json();
}

export function registerUser(email, password) {
  return request('/auth/register', { method: 'POST', body: { email, password } });
}

export function loginUser(email, password) {
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

export function startGuestSession() {
  return request('/auth/guest', { method: 'POST' });
}

export function logoutUser() {
  return request('/auth/logout', { method: 'DELETE' });
}

export function getCurrentUser() {
  return request('/auth/me');
}

// Every metric and raw field definition.
export function getMetrics() {
  return request('/metrics');
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
