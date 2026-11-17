const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

// dbConfig.json is gitignored. deployService.sh copies it to the server with the
// rest of service/*.json, so the credentials never go through GitHub.
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');

// Credentials and sessions: email, password hash, and login token.
const userCollection = db.collection('user');
// Application data: each user's saved tickers and screener setups.
const watchlistCollection = db.collection('watchlist');

// Check the connection before serving anything, and stop if it fails, so a bad
// config shows up in the PM2 logs right away instead of on the first request. Only
// the hostname is logged, never the URL, because the URL holds the password.
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    await createIndexes();
    console.log(`Connected to the database on ${config.hostname}`);
  } catch (ex) {
    console.log(`Unable to connect to the database on ${config.hostname}: ${ex.message}`);
    process.exit(1);
  }
})();

// createIndex does nothing if the index already exists, so this is safe on every start.
async function createIndexes() {
  // One account per email. Guests all share the name "Guest" and have no password
  // hash, so the index only covers real accounts. This also makes two registrations
  // racing for the same email fail instead of creating two accounts.
  await userCollection.createIndex(
    { email: 1 },
    { unique: true, partialFilterExpression: { passwordHash: { $exists: true } } }
  );
  // Every authenticated request looks its user up by token.
  await userCollection.createIndex({ token: 1 });
  // Mongo deletes a guest, and the guest's watchlist, once guestUntil has passed.
  // Accounts have no guestUntil, so they never expire.
  await userCollection.createIndex({ guestUntil: 1 }, { expireAfterSeconds: 0 });
  await watchlistCollection.createIndex({ guestUntil: 1 }, { expireAfterSeconds: 0 });
  // Each user has exactly one watchlist.
  await watchlistCollection.createIndex({ userId: 1 }, { unique: true });
}

// Guests have no password hash, so an email lookup only ever finds a real account.
function getAccount(email) {
  return userCollection.findOne({ email, passwordHash: { $exists: true } });
}

function getUserByToken(token) {
  return userCollection.findOne({ token });
}

// Adds the user and their starting watchlist. Returns the user with its new _id.
// A guest's watchlist gets the same guestUntil, so the TTL index removes both.
async function addUser(user, watchlist) {
  const { insertedId } = await userCollection.insertOne(user);
  const { tickers, setups } = watchlist;
  await watchlistCollection.insertOne({
    userId: insertedId,
    tickers,
    setups,
    ...(user.guestUntil && { guestUntil: user.guestUntil }),
  });
  return { ...user, _id: insertedId };
}

function setToken(userId, token) {
  return userCollection.updateOne({ _id: userId }, { $set: { token } });
}

function clearToken(userId) {
  return userCollection.updateOne({ _id: userId }, { $unset: { token: '' } });
}

async function deleteUser(userId) {
  await watchlistCollection.deleteOne({ userId });
  await userCollection.deleteOne({ _id: userId });
}

// Only the fields the frontend uses: no _id, userId, or guestUntil.
function getWatchlist(userId) {
  return watchlistCollection.findOne({ userId }, { projection: { _id: 0, tickers: 1, setups: 1 } });
}

// Upsert, so a user whose watchlist is somehow missing gets one instead of an error.
function saveWatchlist(userId, { tickers, setups }) {
  return watchlistCollection.updateOne({ userId }, { $set: { tickers, setups } }, { upsert: true });
}

module.exports = {
  getAccount,
  getUserByToken,
  addUser,
  setToken,
  clearToken,
  deleteUser,
  getWatchlist,
  saveWatchlist,
};
