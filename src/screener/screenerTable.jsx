import React from 'react';
import { Cell } from './cell';

export function ScreenerTable({ metrics, columns, rows }) {
  // Each column is a metric id; its name and unit come from the metric definition.
  const shown = columns.map((id) => metrics.find((m) => m.id === id));

  return (
    <>
      <h3>Results</h3>
      <div className="table-responsive">
        <table className="table table-hover results-table">
          <caption>
            {rows.length} of {rows.length} companies &middot; {columns.length} columns &middot; sorted by Net
            margin, high to low
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
            {rows.map((row, i) => (
              <tr key={row.ticker}>
                <td>{i + 1}</td>
                <th scope="row">{row.ticker}</th>
                {shown.map((m) => (
                  <Cell key={m.id} value={row.values[m.id]} unit={m.unit} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="table-note">Hover a dash (&mdash;) to see why the value could not be computed.</p>
    </>
  );
}
