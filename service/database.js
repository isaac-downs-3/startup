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

module.exports = {};
