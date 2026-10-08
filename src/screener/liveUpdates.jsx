import React from 'react';
import { liveUpdates } from './screenerData';

export function LiveUpdates() {
  return (
    <section className="live-updates">
      <h3>Live updates</h3>
      <p>
        WebSocket placeholder. As prices move, the server recomputes price-driven metrics and pushes the
        new values to every open screener, so rows re-rank without a refresh.
      </p>
      <ul>
        {liveUpdates.map((update) => (
          <li className={update.kind} key={update.time}>
            <time>{update.time}</time> &mdash; {update.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
