import React from 'react';
import './watchlist.css';
import { NavLink } from 'react-router-dom';
import { getMetrics, getWatchlist, saveWatchlist } from '../service';

export function Watchlist({ userName }) {
  const [metrics, setMetrics] = React.useState([]);
  // Null until it loads, so nothing can save over it before then.
  const [watchlist, setWatchlist] = React.useState(null);
  const tickers = watchlist?.tickers ?? [];
  const setups = watchlist?.setups ?? [];

  React.useEffect(() => {
    getMetrics().then(setMetrics);
    getWatchlist(userName).then(setWatchlist);
  }, [userName]);

  // Every change is shown at once and saved for the user.
  function update(changes) {
    const next = { ...watchlist, ...changes };
    setWatchlist(next);
    saveWatchlist(userName, next);
  }

  function addTicker(ticker) {
    const added = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD, local time
    const next = [...tickers, { ticker, added }].sort((a, b) => a.ticker.localeCompare(b.ticker));
    update({ tickers: next });
  }

  function removeTicker(ticker) {
    update({ tickers: tickers.filter((t) => t.ticker !== ticker) });
  }

  return (
    <main id="watchlist">
      <h2>Watchlist</h2>
      <p>
        The companies your screener runs on. Your watchlist is saved to your account in the database, so
        it follows you between sessions and devices.
      </p>

      <SavedTickers
        userName={userName}
        tickers={tickers}
        loaded={watchlist !== null}
        onAdd={addTicker}
        onRemove={removeTicker}
      />
      <SavedSetups userName={userName} setups={setups} metrics={metrics} />
    </main>
  );
}

function SavedTickers({ userName, tickers, loaded, onAdd, onRemove }) {
  const [entry, setEntry] = React.useState('');
  const [error, setError] = React.useState('');

  function add(event) {
    event.preventDefault();
    const ticker = entry.trim().toUpperCase();
    if (!/^[A-Z][A-Z.]{0,5}$/.test(ticker)) {
      setError(`${ticker} is not a ticker symbol. Use up to 6 letters, like COST or BRK.B.`);
      return;
    }
    if (tickers.some((t) => t.ticker === ticker)) {
      setError(`${ticker} is already on your watchlist.`);
      return;
    }
    onAdd(ticker);
    setEntry('');
    setError('');
  }

  return (
    <section className="saved-tickers">
      <h3>Saved tickers</h3>
      <form className="input-group" id="add-ticker" onSubmit={add}>
        <label className="input-group-text" htmlFor="ticker">
          Add ticker
        </label>
        <input
          className="form-control"
          type="text"
          id="ticker"
          placeholder="e.g. COST"
          value={entry}
          onChange={(e) => {
            setEntry(e.target.value);
            setError('');
          }}
        />
        <button className="btn btn-primary" type="submit" disabled={!loaded || !entry.trim()}>
          Add
        </button>
      </form>
      {error && (
        <p className="ticker-error" role="alert">
          {error}
        </p>
      )}
      <div className="table-responsive">
        <table className="table table-hover tickers-table">
          <caption>
            Database placeholder &middot; {tickers.length} tickers stored for {userName}
          </caption>
          <thead>
            <tr>
              <th scope="col">Ticker</th>
              <th scope="col">Added</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickers.map(({ ticker, added }) => (
              <tr key={ticker}>
                <th scope="row">{ticker}</th>
                <td>{added}</td>
                <td>
                  <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => onRemove(ticker)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SavedSetups({ userName, setups, metrics }) {
  const nameOf = (id) => metrics.find((m) => m.id === id)?.name;

  return (
    <section className="saved-setups">
      <h3>Saved screener setups</h3>
      <p>Column choices, sort order, and view saved to your account. Open one to load it in the screener.</p>
      <div className="table-responsive">
        <table className="table table-hover setups-table">
          <caption>
            Database placeholder &middot; {setups.length} setups stored for {userName}
          </caption>
          <thead>
            <tr>
              <th scope="col">Setup</th>
              <th scope="col">Columns</th>
              <th scope="col">Sorted by</th>
              <th scope="col">View</th>
              <th scope="col">Last used</th>
            </tr>
          </thead>
          <tbody>
            {setups.map(({ name, setup, lastUsed }) => (
              <tr key={name}>
                <th scope="row">
                  <NavLink to="/screener">{name}</NavLink>
                </th>
                <td>{setup.columns.map(nameOf).join(', ')}</td>
                <td>
                  {nameOf(setup.sort)}, {setup.order === 'desc' ? 'high to low' : 'low to high'}
                </td>
                <td>{setup.view === 'ranks' ? 'Ranks' : 'Values'}</td>
                <td>{lastUsed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
