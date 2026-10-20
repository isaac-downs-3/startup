import React from 'react';

export function LiveUpdates({ updates, paused, onPause }) {
  return (
    <section className="live-updates">
      <div className="live-header">
        <h3 className={paused ? 'paused' : undefined}>Live updates</h3>
        <button className="btn btn-sm btn-outline-secondary" type="button" onClick={onPause}>
          {paused ? 'Resume' : 'Pause'}
        </button>
      </div>
      <p>
        WebSocket placeholder. For now prices are simulated in the browser every few seconds. Each move
        recomputes that company's price-driven metrics, so rows re-rank without a refresh. Later the server
        pushes the moves to every open screener.
      </p>
      <ul>
        {updates.length === 0 && <li>Waiting for the first price move&hellip;</li>}
        {updates.map((update) => (
          <li className={update.kind} key={update.id}>
            <time>{update.time}</time> &mdash; {update.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
