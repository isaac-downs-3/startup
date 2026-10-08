import React from 'react';
import { NavLink } from 'react-router-dom';
import { ScreenerControls } from './screenerControls';
import { DataSource } from './dataSource';
import { ScreenerTable } from './screenerTable';
import { LiveUpdates } from './liveUpdates';

export function Screener() {
  return (
    <main id="screener">
      <h2>Screener</h2>
      <p>
        Every metric defined on the <NavLink to="/metrics">Metrics</NavLink> page, computed for every
        company on your watchlist. Choose which metrics to show as columns, then sort or rank the companies
        on any one of them. Switch to <b>Ranks</b> to see each company's position on a metric instead of
        its value. A dash (&mdash;) is not zero: it means the value could not be computed because an input
        was missing.
      </p>
      <p>
        <i>All values on this page are sample data for illustration only. Not investment advice.</i>
      </p>

      <ScreenerControls />
      <DataSource />
      <ScreenerTable />
      <LiveUpdates />
    </main>
  );
}
