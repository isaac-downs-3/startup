const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const { tickers, setups } = require('./watchlistData');

const app = express();

// The startup service runs on port 4000 unless a port is passed on the command line.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

const authCookieName = 'token';

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

// Log out, ending the session on the server as well as clearing the cookie.
apiRouter.delete('/auth/logout', (req, res) => {
  const user = findByToken(req.cookies[authCookieName]);
  if (user) {
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

// Each user gets their own copy, so one user's changes never reach another's.
function sampleWatchlist() {
  return structuredClone({ tickers, setups });
}

// Guests have no password, so they can never be logged in to by name.
function findAccount(userName) {
  return users.find((user) => user.userName === userName && user.passwordHash);
}

function findByToken(token) {
  return token ? users.find((user) => user.token === token) : undefined;
}

// What the frontend may see of a user. Never the hash or the token.
function publicUser(user) {
  return { userName: user.userName };
}

// Secure unless explicitly running in development. The server sets no NODE_ENV.
function setAuthCookie(res, token) {
  res.cookie(authCookieName, token, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
