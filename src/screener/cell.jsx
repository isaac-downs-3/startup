import React from 'react';
import { formatValue } from './format';

// A missing value shows as a dash with the reason on hover, never as zero.
export function Cell({ value, unit }) {
  if (value.missing) {
    return (
      <td>
        <abbr title={value.missing}>&mdash;</abbr>
      </td>
    );
  }
  return <td className={value < 0 ? 'neg' : undefined}>{formatValue(value, unit)}</td>;
}
