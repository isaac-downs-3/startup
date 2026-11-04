import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Screener } from './screener/screener';
import { Metrics } from './metrics/metrics';
import { Watchlist } from './watchlist/watchlist';
import { About } from './about/about';
import { getCurrentUser, logoutUser, setSignedOutHandler } from './service';

export default function App() {
  // The name to show: the user's email, or Guest. The auth cookie is what signs the
  // user in. This copy in localStorage only keeps a reload from flashing the login
  // page, and the service is asked on load whether the session is still valid.
  const [userName, setUserName] = React.useState(localStorage.getItem('userName') ?? '');

  function logIn(name) {
    localStorage.setItem('userName', name);
    setUserName(name);
  }

  function clearUser() {
    localStorage.removeItem('userName');
    setUserName('');
  }

  // If the service can't be reached the session may still be good, so stay signed in.
  React.useEffect(() => {
    setSignedOutHandler(clearUser);
    if (userName) {
      getCurrentUser()
        .then((user) => logIn(user.email))
        .catch(() => {});
    }
  }, []);

  // Sign out here even if the service can't be reached.
  function logOut() {
    logoutUser()
      .catch(() => {})
      .finally(clearUser);
  }

  return (
    <BrowserRouter>
      <div className="app">
        <header>
          <img src="/logo.svg" alt="Axon Trading House logo" width="48" height="48" />
          <h1>Axon Trading House</h1>
          {userName && (
            <p className="signed-in">
              Signed in as: <b>{userName}</b>{' '}
              <button className="btn btn-sm btn-outline-secondary" type="button" onClick={logOut}>
                Log out
              </button>
            </p>
          )}
          <nav>
            <menu className="nav nav-pills">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Home
                </NavLink>
              </li>
              {userName && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/screener">
                    Screener
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink className="nav-link" to="/metrics">
                  Metrics
                </NavLink>
              </li>
              {userName && (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/watchlist">
                    Watchlist
                  </NavLink>
                </li>
              )}
              <li className="nav-item">
                <NavLink className="nav-link" to="/about">
                  About
                </NavLink>
              </li>
            </menu>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Login signedInAs={userName} onLogin={logIn} onLogout={logOut} />} />
          {/* The screener and watchlist hold a user's data, so signed-out visitors go
              to the login page. Metric definitions are public. */}
          <Route path="/screener" element={userName ? <Screener userName={userName} /> : <Navigate to="/" replace />} />
          <Route path="/metrics" element={<Metrics userName={userName} />} />
          <Route path="/watchlist" element={userName ? <Watchlist userName={userName} /> : <Navigate to="/" replace />} />
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
