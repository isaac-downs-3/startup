import React from 'react';
import './watchlist.css';
import { NavLink } from 'react-router-dom';
import { tickers, setups } from './watchlistData';

export function Watchlist() {
  return (
    <main id="watchlist">
      <h2>Watchlist</h2>
      <p>
        The companies your screener runs on. Your watchlist is saved to your account in the database, so
        it follows you between sessions and devices.
      </p>

      <SavedTickers tickers={tickers} />
      <SavedSetups setups={setups} />
    </main>
  );
}

function SavedTickers({ tickers }) {
  return (
    <section className="saved-tickers">
      <h3>Saved tickers</h3>
      <form className="input-group" id="add-ticker">
        <label className="input-group-text" htmlFor="ticker">
          Add ticker
        </label>
        <input className="form-control" type="text" id="ticker" placeholder="e.g. COST" />
        <button className="btn btn-primary" type="button">
          Add
        </button>
      </form>
      <div className="table-responsive">
        <table className="table table-hover tickers-table">
          <caption>Database placeholder &middot; {tickers.length} tickers stored for analyst</caption>
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
                  <button className="btn btn-sm btn-outline-danger" type="button">
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

function SavedSetups({ setups }) {
  return (
    <section className="saved-setups">
      <h3>Saved screener setups</h3>
      <p>Column choices, sort order, and view saved to your account. Open one to load it in the screener.</p>
      <div className="table-responsive">
        <table className="table table-hover setups-table">
          <caption>Database placeholder &middot; {setups.length} setups stored for analyst</caption>
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
            {setups.map((setup) => (
              <tr key={setup.name}>
                <th scope="row">
                  <NavLink to="/screener">{setup.name}</NavLink>
                </th>
                <td>{setup.columns}</td>
                <td>{setup.sortedBy}</td>
                <td>{setup.view}</td>
                <td>{setup.lastUsed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
