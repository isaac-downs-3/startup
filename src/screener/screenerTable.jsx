import React from 'react';
import { Cell } from './cell';
import { rankOn, sortRows } from './rank';

const sortWord = { desc: 'descending', asc: 'ascending' };

export function ScreenerTable({ metrics, setup, onChange, rows, filter, lastMove }) {
  // Each column is a metric id; its name and unit come from the metric definition.
  const shown = metrics.filter((m) => setup.columns.includes(m.id));
  const sortedBy = metrics.find((m) => m.id === setup.sort);
  // Ranks are over every company, so filtering the list doesn't change them.
  const rank = rankOn(rows, setup.sort, setup.order);
  const visible = sortRows(rows.filter(matches(filter)), setup.sort, setup.order);

  // In the Ranks view each cell is the company's rank on that column's metric,
  // in the same direction as the sort. A missing value keeps its dash and reason.
  const ranks = setup.view === 'ranks';
  const columnRanks = Object.fromEntries(shown.map((m) => [m.id, rankOn(rows, m.id, setup.order)]));
  // Clicking a header sorts on it; clicking the sorted header flips the direction.
  function sortOn(id) {
    const flip = setup.order === 'desc' ? 'asc' : 'desc';
    onChange({ ...setup, sort: id, order: id === setup.sort ? flip : setup.order });
  }

  function cellValue(row, m) {
    const value = row.values[m.id];
    return ranks && typeof value === 'number' ? columnRanks[m.id][row.ticker] : value;
  }

  return (
    <>
      <h3>Results</h3>
      <div className="table-responsive">
        <table className="table table-hover results-table">
          <caption>
            {visible.length} of {rows.length} companies &middot; {shown.length} columns &middot; sorted by{' '}
            {sortedBy?.name}, {setup.order === 'desc' ? 'high to low' : 'low to high'}
            {ranks && <> &middot; showing ranks</>}
          </caption>
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Ticker</th>
              {shown.map((m) => (
                <th scope="col" key={m.id} aria-sort={m.id === setup.sort ? sortWord[setup.order] : undefined}>
                  <button className="sort-header" type="button" onClick={() => sortOn(m.id)}>
                    {m.name}
                    {m.id === setup.sort && (setup.order === 'desc' ? ' ▼' : ' ▲')}
                    <br />
                    <small>{ranks ? `rank, 1 = ${setup.order === 'desc' ? 'highest' : 'lowest'}` : m.unit}</small>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.ticker}>
                <td>{rank[row.ticker] ?? <abbr title="No value to rank on">&mdash;</abbr>}</td>
                <th scope="row">{row.ticker}</th>
                {shown.map((m) => {
                  // A cell the last price move changed flashes green or red. Its key
                  // includes the move, so each new move replays the flash.
                  const moved = lastMove?.ticker === row.ticker && lastMove.changed.includes(m.id);
                  return (
                    <Cell
                      key={moved ? `${m.id}-${lastMove.id}` : m.id}
                      value={cellValue(row, m)}
                      unit={ranks ? 'rank' : m.unit}
                      flash={moved ? lastMove.kind : null}
                    />
                  );
                })}
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
