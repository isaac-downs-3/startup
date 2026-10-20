import React from 'react';
import './screener.css';
import { NavLink } from 'react-router-dom';
import { ScreenerControls } from './screenerControls';
import { SaveSetupForm } from './saveSetupForm';
import { DataSource } from './dataSource';
import { ScreenerTable } from './screenerTable';
import { LiveUpdates } from './liveUpdates';
import { getMetrics, getScreener, getWatchlist, saveWatchlist } from '../service';
import { readSetup, saveSetup } from './setupStore';
import { describeMove, repriceRow, startPriceFeed } from './priceFeed';

// The screener loads its data once and passes it down to the parts that show it.
export function Screener({ userName }) {
  const [metrics, setMetrics] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [setup, setSetup] = React.useState(() => readSetup(userName));
  const [filter, setFilter] = React.useState('');
  const [updates, setUpdates] = React.useState([]);
  const [paused, setPaused] = React.useState(false);

  // The feed's callback reads the latest rows through a ref, so a new price
  // doesn't restart the feed.
  const rowsRef = React.useRef(rows);
  rowsRef.current = rows;

  React.useEffect(() => {
    getMetrics().then(setMetrics);
    getScreener(userName).then(setRows);
  }, [userName]);

  React.useEffect(() => {
    saveSetup(userName, setup);
  }, [userName, setup]);

  // Once the rows are loaded, start the simulated price feed, and stop it when
  // it is paused or the screener closes. Resuming starts it from the current prices. Each new price recomputes that company's price-driven
  // metrics, and the table re-sorts and re-ranks from the new rows.
  const loaded = rows.length > 0;
  React.useEffect(() => {
    if (!loaded || paused) return;
    // Only companies with a price can move.
    const priced = rows.filter((row) => row.price !== null);
    const prices = Object.fromEntries(priced.map((row) => [row.ticker, row.price]));
    return startPriceFeed(prices, (quote) => {
      const before = rowsRef.current.find((row) => row.ticker === quote.ticker);
      const after = repriceRow(before, quote.price);
      setRows((current) => current.map((row) => (row.ticker === after.ticker ? after : row)));
      // The newest move goes on top; keep the last ten.
      setUpdates((current) => [describeMove(before, after, quote.time), ...current].slice(0, 10));
    });
  }, [loaded, paused]);

  // Save the current setup to the user's watchlist. A setup with the same name,
  // ignoring case, is replaced in place and keeps its name. Returns the saved
  // name and whether it replaced one.
  async function saveNamedSetup(name) {
    const watchlist = await getWatchlist(userName);
    const existing = watchlist.setups.find((s) => s.name.toLowerCase() === name.toLowerCase());
    const lastUsed = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time
    const saved = { name: existing?.name ?? name, setup, lastUsed };
    const setups = existing
      ? watchlist.setups.map((s) => (s === existing ? saved : s))
      : [...watchlist.setups, saved];
    await saveWatchlist(userName, { ...watchlist, setups });
    return { name: saved.name, replaced: Boolean(existing) };
  }

  return (
    <main id="screener">
      <h2>Screener</h2>
      <p>
        Every metric defined on the <NavLink to="/metrics">Metrics</NavLink> page, computed for every
        company on your watchlist. Choose which metrics to show as columns, then sort the companies on any
        one of them from the menu or by clicking its header. Switch to <b>Ranks</b> to see each company's
        position on every metric instead of its value, counted in the sort direction. A dash (&mdash;) is
        not zero: it means the value could not be computed because an input was missing, and it is never
        ranked. Your setup is saved, so the screener opens the way you left it.
      </p>
      <p>
        <i>All values on this page are sample data for illustration only. Not investment advice.</i>
      </p>

      <div className="controls-column">
        <ScreenerControls metrics={metrics} setup={setup} onChange={setSetup} filter={filter} onFilter={setFilter} />
        <SaveSetupForm onSave={saveNamedSetup} />
      </div>
      <DataSource />
      <ScreenerTable
        metrics={metrics}
        setup={setup}
        onChange={setSetup}
        rows={rows}
        filter={filter}
        lastMove={updates[0]}
      />
      <LiveUpdates updates={updates} paused={paused} onPause={() => setPaused((p) => !p)} />
    </main>
  );
}
