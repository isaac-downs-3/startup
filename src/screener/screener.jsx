import React from 'react';
import './screener.css';
import { NavLink } from 'react-router-dom';
import { ScreenerControls } from './screenerControls';
import { DataSource } from './dataSource';
import { ScreenerTable } from './screenerTable';
import { LiveUpdates } from './liveUpdates';
import { getMetrics, getScreener } from '../service';
import { liveUpdates } from './screenerData';
import { readSetup, saveSetup } from './setupStore';

// The screener loads its data once and passes it down to the parts that show it.
export function Screener({ userName }) {
  const [metrics, setMetrics] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [setup, setSetup] = React.useState(() => readSetup(userName));
  const [filter, setFilter] = React.useState('');

  React.useEffect(() => {
    getMetrics().then(setMetrics);
    getScreener().then(setRows);
  }, []);

  React.useEffect(() => {
    saveSetup(userName, setup);
  }, [userName, setup]);

  return (
    <main id="screener">
      <h2>Screener</h2>
      <p>
        Every metric defined on the <NavLink to="/metrics">Metrics</NavLink> page, computed for every
        company on your watchlist. Choose which metrics to show as columns, then sort the companies on any
        one of them from the menu or by clicking its header. Switch to <b>Ranks</b> to see each company's
        position on every metric instead of its value, counted in the sort direction. A dash (&mdash;) is
        not zero: it means the value could not be computed because an input was missing, and it is never
        ranked. Your setup is saved, so the screener opens the way you left it.
      </p>
      <p>
        <i>All values on this page are sample data for illustration only. Not investment advice.</i>
      </p>

      <ScreenerControls metrics={metrics} setup={setup} onChange={setSetup} filter={filter} onFilter={setFilter} />
      <DataSource />
      <ScreenerTable metrics={metrics} setup={setup} onChange={setSetup} rows={rows} filter={filter} />
      <LiveUpdates updates={liveUpdates} />
    </main>
  );
}
