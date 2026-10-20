// Order companies on one metric. A missing value sorts last whichever the
// direction, because a dash is not a number.
export function sortRows(rows, id, order) {
  return [...rows].sort((a, b) => {
    const x = a.values[id];
    const y = b.values[id];
    const xMissing = typeof x !== 'number';
    const yMissing = typeof y !== 'number';
    if (xMissing || yMissing) return xMissing - yMissing;
    return order === 'desc' ? y - x : x - y;
  });
}

// Each company's rank on one metric, keyed by ticker. 1 is first in the sort
// direction, ties share a rank, and a missing value gets no rank.
export function rankOn(rows, id, order) {
  const ranks = {};
  sortRows(rows, id, order).forEach((row, i, sorted) => {
    const value = row.values[id];
    if (typeof value !== 'number') return;
    const previous = sorted[i - 1];
    ranks[row.ticker] = previous?.values[id] === value ? ranks[previous.ticker] : i + 1;
  });
  return ranks;
}
