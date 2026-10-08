import React from 'react';
import { metrics } from './metricsData';

export function MetricsTable() {
  const computed = metrics.filter((m) => m.kind === 'metric').length;
  const raw = metrics.length - computed;

  return (
    <div className="table-responsive">
      <table className="table metrics-table">
        <caption>
          {metrics.length} values &middot; {computed} metrics and {raw} raw fields &middot; coverage across 12
          companies
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
