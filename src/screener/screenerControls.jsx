import React from 'react';
import { NavLink } from 'react-router-dom';

export function ScreenerControls({ metrics, columns }) {
  // Every computed metric can be a column; the ones currently shown start checked.
  const computed = metrics.filter((m) => m.kind === 'metric');
  const shown = computed.filter((m) => columns.some((c) => c.id === m.id));

  return (
    <form className="screener-controls">
      <fieldset>
        <legend>Screen</legend>
        <div className="control-row">
          <label className="form-label" htmlFor="filter">
            Filter tickers
          </label>
          <input className="form-control" type="search" id="filter" placeholder="AAPL, MSFT..." />
        </div>
        <div className="control-row">
          <span className="form-label">Show</span>
          <div className="btn-group" role="group" aria-label="Show">
            <input className="btn-check" type="radio" id="view-values" name="view" value="values" defaultChecked />
            <label className="btn btn-outline-secondary" htmlFor="view-values">
              Values
            </label>
            <input className="btn-check" type="radio" id="view-ranks" name="view" value="ranks" />
            <label className="btn btn-outline-secondary" htmlFor="view-ranks">
              Ranks
            </label>
          </div>
        </div>
        <div className="control-row">
          <label className="form-label" htmlFor="sort">
            Sort by
          </label>
          <div className="sort-controls">
            <select className="form-select" id="sort" defaultValue="net_margin">
              {shown.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <div className="btn-group" role="group" aria-label="Sort direction">
              <input className="btn-check" type="radio" id="order-desc" name="order" value="desc" defaultChecked />
              <label className="btn btn-outline-secondary" htmlFor="order-desc">
                High to low
              </label>
              <input className="btn-check" type="radio" id="order-asc" name="order" value="asc" />
              <label className="btn btn-outline-secondary" htmlFor="order-asc">
                Low to high
              </label>
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset>
        <legend>
          Columns ({shown.length} of {computed.length} metrics)
        </legend>
        <p>
          Any metric defined on the <NavLink to="/metrics">Metrics</NavLink> page can be a column.
        </p>
        <div className="column-picker">
          {computed.map((m) => (
            <div className="form-check" key={m.id}>
              <input
                className="form-check-input"
                type="checkbox"
                id={`col-${m.id}`}
                value={m.id}
                defaultChecked={shown.includes(m)}
              />
              <label className="form-check-label" htmlFor={`col-${m.id}`}>
                {m.name}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      <button className="btn btn-primary" type="button">
        Apply
      </button>
    </form>
  );
}
