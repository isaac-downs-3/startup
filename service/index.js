const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const DB = require('./database.js');
const { metrics } = require('./metricsData');
const { rows } = require('./screenerData');
const { tickers, setups } = require('./watchlistData');

const app = express();

// The startup service runs on port 4000 unless a port is passed on the command line.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

const authCookieName = 'token';
const accountLifetimeMs = 1000 * 60 * 60 * 24 * 365;
const guestLifetimeMs = 1000 * 60 * 60 * 24;

// What a guest is shown as. It isn't a valid email, so no account can have it.
const guestName = 'Guest';

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
    res.status(400).send({ msg: 'A valid email and a password are required' });
  } else if (await DB.getAccount(credentials.email)) {
    res.status(409).send({ msg: alreadyRegistered(credentials.email) });
  } else {
    let user;
    try {
      user = await createUser(credentials);
    } catch (err) {
      // Another registration for this email got in first, and the unique index caught it.
      if (err.code === 11000) {
        res.status(409).send({ msg: alreadyRegistered(credentials.email) });
        return;
      }
      throw err;
    }
    setAuthCookie(res, user.token);
    res.send(publicUser(user));
  }
});

// Log in to an existing account. A new token replaces any earlier one.
apiRouter.post('/auth/login', async (req, res) => {
  const credentials = readCredentials(req.body);
  if (!credentials) {
    res.status(400).send({ msg: 'A valid email and a password are required' });
    return;
  }
  const user = await DB.getAccount(credentials.email);
  if (user && (await bcrypt.compare(credentials.password, user.passwordHash))) {
    const token = uuid.v4();
    await DB.setToken(user._id, token);
    setAuthCookie(res, token);
    res.send(publicUser(user));
  } else {
    res.status(401).send({ msg: 'Wrong email or password' });
  }
});

// Start a temporary session with no account. Every guest gets their own watchlist.
// The database's TTL index deletes the guest and their watchlist once guestUntil passes.
apiRouter.post('/auth/guest', async (_req, res) => {
  const user = await DB.addUser(
    { email: guestName, token: uuid.v4(), guestUntil: new Date(Date.now() + guestLifetimeMs) },
    sampleWatchlist()
  );
  setAuthCookie(res, user.token, guestLifetimeMs);
  res.send(publicUser(user));
});

// Log out, ending the session on the server as well as clearing the cookie. A
// guest has no account to come back to, so their data goes too.
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findByToken(req.cookies[authCookieName]);
  if (user?.guestUntil) {
    await DB.deleteUser(user._id);
  } else if (user) {
    await DB.clearToken(user._id);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Only continue if the request's cookie belongs to a signed-in user.
async function verifyAuth(req, res, next) {
  const user = await findByToken(req.cookies[authCookieName]);
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
apiRouter.get('/screener', verifyAuth, async (req, res) => {
  const { tickers } = await watchlistFor(req.user);
  res.send(tickers.map(({ ticker }) => rowFor(ticker)));
});

// The screener's current setup, so it opens the way the user left it on any device.
// An empty object means the user hasn't changed it, and the frontend uses its default.
apiRouter.get('/screener/setup', verifyAuth, async (req, res) => {
  res.send((await DB.getCurrentSetup(req.user._id)) ?? {});
});

apiRouter.put('/screener/setup', verifyAuth, async (req, res) => {
  if (!isSetup(req.body)) {
    res.status(400).send({ msg: 'That is not a valid screener setup' });
    return;
  }
  const setup = cleanSetup(req.body);
  await DB.saveCurrentSetup(req.user._id, setup);
  res.send(setup);
});

// The user's saved tickers and screener setups.
apiRouter.get('/watchlist', verifyAuth, async (req, res) => {
  res.send(await watchlistFor(req.user));
});

// Replace the user's saved tickers and screener setups.
apiRouter.put('/watchlist', verifyAuth, async (req, res) => {
  const watchlist = readWatchlist(req.body);
  if (!watchlist) {
    res.status(400).send({ msg: 'That is not a valid watchlist' });
    return;
  }
  await DB.saveWatchlist(req.user._id, watchlist);
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

// The email, trimmed and lowercased so one address can't hold two accounts, and
// the password. Null if the email isn't valid or the password is missing.
function readCredentials(body) {
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = body?.password;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (typeof password !== 'string' || !password) return null;
  return { email, password };
}

// Only the bcrypt hash is stored, never the password itself.
async function createUser({ email, password }) {
  const user = { email, passwordHash: await bcrypt.hash(password, 10), token: uuid.v4() };
  return DB.addUser(user, sampleWatchlist());
}

function alreadyRegistered(email) {
  return `${email} already has an account. Log in instead.`;
}

// A user whose watchlist is missing starts from the sample one rather than failing.
async function watchlistFor(user) {
  return (await DB.getWatchlist(user._id)) ?? sampleWatchlist();
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
    setups: setups.map(({ name, setup, lastUsed }) => ({ name, setup: cleanSetup(setup), lastUsed })),
  };
}

function isShortText(value) {
  return typeof value === 'string' && value.length > 0 && value.length <= 100;
}

function isSavedTicker(entry) {
  return typeof entry?.ticker === 'string' && /^[A-Z][A-Z.]{0,5}$/.test(entry.ticker) && isShortText(entry.added);
}

function isSavedSetup(entry) {
  return isShortText(entry?.name) && isShortText(entry?.lastUsed) && isSetup(entry?.setup);
}

// The screener's columns, sort, and view, as the current setup or inside a saved one.
function isSetup(setup) {
  return (
    Array.isArray(setup?.columns) &&
    setup.columns.length <= 100 &&
    setup.columns.every(isShortText) &&
    isShortText(setup.sort) &&
    ['asc', 'desc'].includes(setup.order) &&
    ['values', 'ranks'].includes(setup.view)
  );
}

// Only the expected fields, so nothing extra in a request gets stored.
function cleanSetup({ columns, sort, order, view }) {
  return { columns, sort, order, view };
}

// Each user gets their own copy, so one user's changes never reach another's.
function sampleWatchlist() {
  return structuredClone({ tickers, setups });
}

// Mongo's TTL cleanup runs about once a minute, so an expired guest can still be in
// the database briefly. Checking guestUntil here ends the session on time anyway.
async function findByToken(token) {
  if (typeof token !== 'string' || !token) return undefined;
  const user = await DB.getUserByToken(token);
  return user && !isExpiredGuest(user) ? user : undefined;
}

function isExpiredGuest(user) {
  return user.guestUntil !== undefined && user.guestUntil <= new Date();
}

// What the frontend may see of a user. Never the hash or the token.
function publicUser(user) {
  return { email: user.email };
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
