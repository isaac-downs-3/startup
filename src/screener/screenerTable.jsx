import React from 'react';
import { metricName } from '../metrics/metricsData';
import { Cell } from './cell';

export function ScreenerTable({ columns, rows }) {
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
              {columns.map((c) => (
                <th scope="col" key={c.id}>
                  {metricName(c.id)}
                  <br />
                  <small>{c.unit}</small>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.ticker}>
                <td>{i + 1}</td>
                <th scope="row">{row.ticker}</th>
                {row.values.map((value, j) => (
                  <Cell key={columns[j].id} value={value} />
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
