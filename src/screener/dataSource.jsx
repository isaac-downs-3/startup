import React from 'react';

export function DataSource() {
  return (
    <aside className="data-source">
      <h3>Data source</h3>
      <p>
        Quotes and financial statement fields from <a href="https://finnhub.io/docs/api">Finnhub</a> (3rd
        party API placeholder, not yet connected). Prices start at the 2025-06-30 close and then move by
        simulated amounts, not real trades; financials as of each company's latest quarterly report.
      </p>
    </aside>
  );
}
