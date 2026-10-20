import React from 'react';
import { formatValue } from './format';

// A missing value shows as a dash with the reason on hover, never as zero.
// `flash` is 'up' or 'down' when a price move just changed the value.
export function Cell({ value, unit, flash }) {
  if (value.missing) {
    return (
      <td>
        <abbr title={value.missing}>&mdash;</abbr>
      </td>
    );
  }
  const classes = [value < 0 && 'neg', flash && `flash-${flash}`].filter(Boolean).join(' ');
  return <td className={classes || undefined}>{formatValue(value, unit)}</td>;
}
