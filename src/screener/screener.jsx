import React from 'react';
import './screener.css';
import { NavLink } from 'react-router-dom';
import { ScreenerControls } from './screenerControls';
import { DataSource } from './dataSource';
import { ScreenerTable } from './screenerTable';
import { LiveUpdates } from './liveUpdates';
import { getMetrics, getScreener } from '../service';
import { defaultSetup, liveUpdates } from './screenerData';

// The screener loads its data once and passes it down to the parts that show it.
export function Screener() {
  const [metrics, setMetrics] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [setup, setSetup] = React.useState(defaultSetup);
  const [filter, setFilter] = React.useState('');

  React.useEffect(() => {
    getMetrics().then(setMetrics);
    getScreener().then(setRows);
  }, []);

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

      <ScreenerControls metrics={metrics} setup={setup} onChange={setSetup} filter={filter} onFilter={setFilter} />
      <DataSource />
      <ScreenerTable metrics={metrics} setup={setup} rows={rows} filter={filter} />
      <LiveUpdates updates={liveUpdates} />
    </main>
  );
}
