import React from 'react';
import { NavLink } from 'react-router-dom';
import { MetricsTable } from './metricsTable';

const kinds = ['all', 'metric', 'flow', 'stock', 'rate', 'label'];

export function Metrics() {
  return (
    <main id="metrics">
      <h2>Metrics</h2>
      <p>
        Every value the <NavLink to="/screener">Screener</NavLink> can show: the raw data fields as they
        arrive from the data vendor, and the metrics computed from them. Open a metric to see its formula
        and the raw fields it reads, so you always know what a number means before you rank on it.
      </p>
      <p>
        <b>Coverage</b> is the share of companies with a usable value. A metric's coverage is only as
        good as its worst input, and a low coverage will quietly shrink any screen built on it.{' '}
        <b>Kind</b> says what sort of value it is: a <i>metric</i> is computed; a <i>flow</i> accumulates
        over a period and can be summed (revenue); a <i>stock</i> is a level at a point in time and is
        not summed (total debt); a <i>rate</i> is observed at a moment (price); a <i>label</i> is text
        (sector). <b>Grain</b> is how often the value is reported.
      </p>

      {/* Filtering is wired up with reactivity in the next deliverable. */}
      <form className="metrics-filter">
        <fieldset>
          <legend>Find a value</legend>
          <div className="control-row">
            <label className="form-label" htmlFor="filter">
              Filter
            </label>
            <input className="form-control" type="search" id="filter" placeholder="revenue, margin, shares..." />
          </div>
          <div className="control-row">
            <span className="form-label">Kind</span>
            <div className="btn-group flex-wrap" role="group" aria-label="Kind">
              {kinds.map((kind) => (
                <React.Fragment key={kind}>
                  <input
                    className="btn-check"
                    type="radio"
                    id={`kind-${kind}`}
                    name="kind"
                    value={kind}
                    defaultChecked={kind === 'all'}
                  />
                  <label className="btn btn-outline-secondary btn-sm" htmlFor={`kind-${kind}`}>
                    {kind[0].toUpperCase() + kind.slice(1)}
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>
        </fieldset>
        <button className="btn btn-primary" type="button">
          Apply
        </button>
      </form>

      <MetricsTable />
    </main>
  );
}
