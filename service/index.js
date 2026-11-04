const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const { metrics } = require('./metricsData');
const { rows } = require('./screenerData');
const { tickers, setups } = require('./watchlistData');

const app = express();

// The startup service runs on port 4000 unless a port is passed on the command line.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

const authCookieName = 'token';
const accountLifetimeMs = 1000 * 60 * 60 * 24 * 365;
const guestLifetimeMs = 1000 * 60 * 60 * 24;

// Users and their watchlists live in memory, so a restart loses them until the
// database deliverable.
let users = [];

app.use(express.json());
app.use(cookieParser());

// Serve the bundled frontend. The deploy script puts it in a public directory next to this file.
app.use(express.static('public'));

const apiRouter = express.Router();
app.use('/api', apiRouter);

// Register a new account and sign it in.
apiRouter.post('/auth/register', async (req, res) => {
  const credentials = readCredentials(req.body);
  if (!credentials) {
    res.status(400).send({ msg: 'A username and password are required' });
  } else if (credentials.userName.toLowerCase() === 'guest') {
    res.status(409).send({ msg: 'Guest is reserved. Pick another name.' });
  } else if (findAccount(credentials.userName)) {
    res.status(409).send({ msg: `${credentials.userName} already has an account. Log in instead.` });
  } else {
    const user = await createUser(credentials);
    setAuthCookie(res, user.token);
    res.send(publicUser(user));
  }
});

// Log in to an existing account. A new token replaces any earlier one.
apiRouter.post('/auth/login', async (req, res) => {
  const credentials = readCredentials(req.body);
  if (!credentials) {
    res.status(400).send({ msg: 'A username and password are required' });
    return;
  }
  const user = findAccount(credentials.userName);
  if (user && (await bcrypt.compare(credentials.password, user.passwordHash))) {
    user.token = uuid.v4();
    setAuthCookie(res, user.token);
    res.send(publicUser(user));
  } else {
    res.status(401).send({ msg: 'Wrong username or password' });
  }
});

// Start a temporary session with no account. Every guest gets their own watchlist.
apiRouter.post('/auth/guest', (_req, res) => {
  users = users.filter((user) => !isExpiredGuest(user));
  const user = {
    userName: 'Guest',
    token: uuid.v4(),
    watchlist: sampleWatchlist(),
    guestUntil: Date.now() + guestLifetimeMs,
  };
  users.push(user);
  setAuthCookie(res, user.token, guestLifetimeMs);
  res.send(publicUser(user));
});

// Log out, ending the session on the server as well as clearing the cookie. A
// guest has no account to come back to, so their data goes too.
apiRouter.delete('/auth/logout', (req, res) => {
  const user = findByToken(req.cookies[authCookieName]);
  if (user?.guestUntil) {
    users = users.filter((other) => other !== user);
  } else if (user) {
    delete user.token;
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Only continue if the request's cookie belongs to a signed-in user.
function verifyAuth(req, res, next) {
  const user = findByToken(req.cookies[authCookieName]);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
}

// Who the cookie belongs to, so the frontend can restore a session on page load.
apiRouter.get('/auth/me', verifyAuth, (req, res) => {
  res.send(publicUser(req.user));
});

// Every metric and raw field definition. These are public.
apiRouter.get('/metrics', (_req, res) => {
  res.send(metrics);
});

// One row per company on the user's watchlist, with every metric's value. The
// frontend sorts and ranks them, because the price feed re-ranks them in the browser.
apiRouter.get('/screener', verifyAuth, (req, res) => {
  res.send(req.user.watchlist.tickers.map(({ ticker }) => rowFor(ticker)));
});

// The user's saved tickers and screener setups.
apiRouter.get('/watchlist', verifyAuth, (req, res) => {
  res.send(req.user.watchlist);
});

// Replace the user's saved tickers and screener setups.
apiRouter.put('/watchlist', verifyAuth, (req, res) => {
  const watchlist = readWatchlist(req.body);
  if (!watchlist) {
    res.status(400).send({ msg: 'That is not a valid watchlist' });
    return;
  }
  req.user.watchlist = watchlist;
  res.send(watchlist);
});

// An unknown API path is an error, not a page of the app.
apiRouter.use((_req, res) => {
  res.status(404).send({ msg: 'Not found' });
});

// Any other path is a React Router view, so return the app and let it decide.
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// A bad request (such as malformed JSON) keeps its status. Anything else is logged
// here, and the details stay out of the response.
app.use((err, _req, res, _next) => {
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  res.status(status).send({ msg: status >= 500 ? 'Something went wrong' : 'Bad request' });
});

// The trimmed username and the password, or null if either is missing.
function readCredentials(body) {
  const userName = typeof body?.userName === 'string' ? body.userName.trim() : '';
  const password = body?.password;
  if (!userName || typeof password !== 'string' || !password) return null;
  return { userName, password };
}

async function createUser({ userName, password }) {
  const user = {
    userName,
    passwordHash: await bcrypt.hash(password, 10),
    token: uuid.v4(),
    watchlist: sampleWatchlist(),
  };
  users.push(user);
  return user;
}

// A ticker the sample data doesn't cover gets a row of dashes that say why.
function rowFor(ticker) {
  const row = rows.find((row) => row.ticker === ticker);
  if (row) return row;
  const missing = { missing: 'No sample data for this ticker until Finnhub is connected' };
  const values = Object.fromEntries(Object.keys(rows[0].values).map((id) => [id, missing]));
  return { ticker, price: null, values };
}

// A clean copy of a submitted watchlist with only the expected fields, or null if
// any part of it is invalid.
function readWatchlist(body) {
  const { tickers, setups } = body ?? {};
  if (!Array.isArray(tickers) || tickers.length > 100) return null;
  if (!Array.isArray(setups) || setups.length > 50) return null;
  if (!tickers.every(isSavedTicker) || !setups.every(isSavedSetup)) return null;
  if (new Set(tickers.map((t) => t.ticker)).size !== tickers.length) return null;
  return {
    tickers: tickers.map(({ ticker, added }) => ({ ticker, added })),
    setups: setups.map(({ name, setup, lastUsed }) => ({
      name,
      setup: { columns: setup.columns, sort: setup.sort, order: setup.order, view: setup.view },
      lastUsed,
    })),
  };
}

function isShortText(value) {
  return typeof value === 'string' && value.length > 0 && value.length <= 100;
}

function isSavedTicker(entry) {
  return typeof entry?.ticker === 'string' && /^[A-Z][A-Z.]{0,5}$/.test(entry.ticker) && isShortText(entry.added);
}

function isSavedSetup(entry) {
  const setup = entry?.setup;
  return (
    isShortText(entry?.name) &&
    isShortText(entry?.lastUsed) &&
    Array.isArray(setup?.columns) &&
    setup.columns.length <= 100 &&
    setup.columns.every(isShortText) &&
    isShortText(setup.sort) &&
    ['asc', 'desc'].includes(setup.order) &&
    ['values', 'ranks'].includes(setup.view)
  );
}

// Each user gets their own copy, so one user's changes never reach another's.
function sampleWatchlist() {
  return structuredClone({ tickers, setups });
}

// Guests have no password, so they can never be logged in to by name.
function findAccount(userName) {
  return users.find((user) => user.userName === userName && user.passwordHash);
}

function findByToken(token) {
  const user = token ? users.find((user) => user.token === token) : undefined;
  return user && !isExpiredGuest(user) ? user : undefined;
}

function isExpiredGuest(user) {
  return user.guestUntil !== undefined && user.guestUntil <= Date.now();
}

// What the frontend may see of a user. Never the hash or the token.
function publicUser(user) {
  return { userName: user.userName };
}

// Secure unless explicitly running in development. The server sets no NODE_ENV.
function setAuthCookie(res, token, maxAge = accountLifetimeMs) {
  res.cookie(authCookieName, token, {
    maxAge,
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
