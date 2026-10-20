import React from 'react';
import { Cell } from './cell';
import { rankOn, sortRows } from './rank';

export function ScreenerTable({ metrics, setup, rows, filter }) {
  // Each column is a metric id; its name and unit come from the metric definition.
  const shown = metrics.filter((m) => setup.columns.includes(m.id));
  const sortedBy = metrics.find((m) => m.id === setup.sort);
  // Ranks are over every company, so filtering the list doesn't change them.
  const rank = rankOn(rows, setup.sort, setup.order);
  const visible = sortRows(rows.filter(matches(filter)), setup.sort, setup.order);

  return (
    <>
      <h3>Results</h3>
      <div className="table-responsive">
        <table className="table table-hover results-table">
          <caption>
            {visible.length} of {rows.length} companies &middot; {shown.length} columns &middot; sorted by{' '}
            {sortedBy?.name}, {setup.order === 'desc' ? 'high to low' : 'low to high'}
          </caption>
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Ticker</th>
              {shown.map((m) => (
                <th scope="col" key={m.id}>
                  {m.name}
                  <br />
                  <small>{m.unit}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.ticker}>
                <td>{rank[row.ticker] ?? <abbr title="No value to rank on">&mdash;</abbr>}</td>
                <th scope="row">{row.ticker}</th>
                {shown.map((m) => (
                  <Cell key={m.id} value={row.values[m.id]} unit={m.unit} />
                ))}
              </tr>
            ))}
            {visible.length === 0 && rows.length > 0 && (
              <tr>
                <td colSpan={shown.length + 2}>No tickers match the filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="table-note">Hover a dash (&mdash;) to see why the value could not be computed.</p>
    </>
  );
}

// "aapl, ms" keeps AAPL and MSFT: each word is the start of a ticker to keep.
function matches(filter) {
  const words = filter.toUpperCase().split(/[\s,]+/).filter(Boolean);
  return (row) => words.length === 0 || words.some((word) => row.ticker.startsWith(word));
}
