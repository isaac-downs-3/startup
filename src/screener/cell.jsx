import React from 'react';

// A missing value shows as a dash with the reason on hover, never as zero.
export function Cell({ value }) {
  if (value.missing) {
    return (
      <td>
        <abbr title={value.missing}>&mdash;</abbr>
      </td>
    );
  }
  return <td className={value.startsWith('-') ? 'neg' : undefined}>{value}</td>;
}
