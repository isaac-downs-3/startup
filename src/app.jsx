import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Screener } from './screener/screener';
import { Metrics } from './metrics/metrics';
import { Watchlist } from './watchlist/watchlist';
import { About } from './about/about';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <img src="/logo.svg" alt="Axon Trading House logo" width="48" height="48" />
          <h1>Axon Trading House</h1>
          {/* "Signed in as" shows on every page except login. */}
          <Routes>
            <Route path="/" element={null} />
            <Route
              path="*"
              element={
                <p className="signed-in">
                  Signed in as: <b>analyst</b>
                </p>
              }
            />
          </Routes>
          <nav>
            <menu className="nav nav-pills">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/screener">
                  Screener
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/metrics">
                  Metrics
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/watchlist">
                  Watchlist
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
              </li>
            </menu>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/screener" element={<Screener />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer>
          <p>Isaac Downs</p>
          <a href="https://github.com/isaac-downs-3/startup">GitHub</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main id="not-found">
      <h2>Page not found</h2>
      <p>
        That address is not part of Axon Trading House. Use the navigation above to get back to a
        page.
      </p>
    </main>
  );
}
