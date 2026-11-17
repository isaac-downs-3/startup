const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

// dbConfig.json is gitignored. deployService.sh copies it to the server with the
// rest of service/*.json, so the credentials never go through GitHub.
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('startup');

// Check the connection before serving anything, and stop if it fails, so a bad
// config shows up in the PM2 logs right away instead of on the first request. Only
// the hostname is logged, never the URL, because the URL holds the password.
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    console.log(`Connected to the database on ${config.hostname}`);
  } catch (ex) {
    console.log(`Unable to connect to the database on ${config.hostname}: ${ex.message}`);
    process.exit(1);
  }
})();

module.exports = {};
