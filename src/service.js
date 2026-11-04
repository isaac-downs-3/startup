// Calls to the backend service. The cookie that identifies the user is set by the
// service and sent by the browser, so it never appears in this code.

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

// One row per company on the user's watchlist, with every metric's value.
export function getScreener() {
  return request('/screener');
}

// The user's saved tickers and screener setups.
export function getWatchlist() {
  return request('/watchlist');
}

// Replace the user's saved tickers and screener setups.
export function saveWatchlist(watchlist) {
  return request('/watchlist', { method: 'PUT', body: watchlist });
}
