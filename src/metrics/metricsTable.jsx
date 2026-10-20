import React from 'react';

export function MetricsTable({ metrics, total }) {
  const computed = metrics.filter((m) => m.kind === 'metric').length;
  const raw = metrics.length - computed;

  return (
    <div className="table-responsive">
      <table className="table metrics-table">
        <caption>
          {metrics.length} of {total} values &middot; {plural(computed, 'metric')} and{' '}
          {plural(raw, 'raw field')} &middot; coverage across 12 companies
        </caption>
        <thead>
          <tr>
            <th scope="col">Value</th>
            <th scope="col">Name</th>
            <th scope="col">Kind</th>
            <th scope="col">Grain</th>
            <th scope="col">Coverage</th>
            <th scope="col">Definition</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <MetricRow key={metric.id} metric={metric} />
          ))}
          {metrics.length === 0 && total > 0 && (
            <tr>
              <td colSpan="6">No values match the filter.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function MetricRow({ metric }) {
  const percent = `${Math.round(metric.coverage * 100)}%`;

  return (
    <tr>
      <th scope="row">{metric.name}</th>
      <td>
        <code>{metric.id}</code>
      </td>
      <td>
        <span className={`kind kind-${metric.kind}`}>{metric.kind}</span>
      </td>
      <td>{metric.grain}</td>
      <td>
        <meter min="0" max="1" value={metric.coverage}>
          {percent}
        </meter>{' '}
        {percent}
      </td>
      <td>{metric.formula ? <Formula metric={metric} /> : 'Raw field from Finnhub'}</td>
    </tr>
  );
}

function Formula({ metric }) {
  return (
    <details>
      <summary>Formula</summary>
      <p>
        <code>{metric.id}</code> = {metric.formula}
      </p>
      <p>
        Reads raw fields:{' '}
        {metric.reads.map((field, i) => (
          <React.Fragment key={field}>
            {i > 0 && ', '}
            <code>{field}</code>
          </React.Fragment>
        ))}
      </p>
    </details>
  );
}

// plural(1, 'metric') -> '1 metric', plural(5, 'metric') -> '5 metrics'
function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}
