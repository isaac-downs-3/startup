import React from 'react';
import './about.css';
import { NavLink } from 'react-router-dom';

export function About() {
  return (
    <main id="about">
      <h2>About</h2>
      <p>
        Axon Trading House is a proprietary trading firm buying and selling public securities:
        equities, options, and bonds. This application is its research desk: a place to define the
        metrics that matter, then screen, rank, and monitor companies against them.
      </p>

      <section>
        <h3>Why define metrics in the open</h3>
        <p>
          Most stock screeners hand you a fixed list of numbers computed some way you cannot see. Two
          screeners can show different net margins for the same company, and neither tells you why.
          Here every metric lives on the <NavLink to="/metrics">Metrics</NavLink> page with its formula
          and the raw fields it reads, so you know exactly what a number means before you rank on it.
        </p>
      </section>

      <section>
        <h3>How a metric is built</h3>
        <img
          src="/metric-flow.svg"
          alt="Diagram: raw fields feed metric formulas, which feed the ranked screener"
          width="720"
          height="220"
        />
        <ol>
          <li>
            <b>Raw fields</b> arrive from the data vendor: revenue, net income, shares outstanding, price.
          </li>
          <li>
            <b>Metrics</b> are formulas over those fields, such as net margin = net income &divide; revenue.
          </li>
          <li>
            <b>Coverage</b> counts how many companies have every input the formula needs.
          </li>
          <li>
            <b>The screener</b> computes the metrics you choose for every company on your watchlist and
            ranks them.
          </li>
        </ol>
      </section>

      <section className="alert alert-warning">
        <h3>Important information</h3>
        <p>
          This is a class project. All data shown is sample data for illustration only and may be out
          of date. Nothing on this site is investment advice or a recommendation to buy or sell any
          security.
        </p>
      </section>
    </main>
  );
}
