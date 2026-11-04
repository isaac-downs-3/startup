const express = require('express');

const app = express();

// The startup service runs on port 4000 unless a port is passed on the command line.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Serve the bundled frontend. The deploy script puts it in a public directory next to this file.
app.use(express.static('public'));

// Any other path is a React Router view, so return the app and let it decide.
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
