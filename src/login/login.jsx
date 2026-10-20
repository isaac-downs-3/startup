import React from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

// A guest skips the form. Their watchlist and setups are kept under this name,
// so no account can take it.
const guestName = 'Guest';

export function Login({ signedInAs, onLogin, onLogout }) {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const name = userName.trim();

  // Login is mocked for now. Accounts are a list of names in localStorage; the
  // password is never checked or stored until the service deliverable.
  function logIn(event) {
    event.preventDefault();
    if (!readAccounts().includes(name)) {
      setError(`There is no account for ${name}. Create one first.`);
      return;
    }
    signIn(name);
  }

  function createAccount() {
    const accounts = readAccounts();
    if (name.toLowerCase() === guestName.toLowerCase()) {
      setError(`${guestName} is reserved. Use Continue as guest below, or pick another name.`);
      return;
    }
    if (accounts.includes(name)) {
      setError(`${name} already has an account. Log in instead.`);
      return;
    }
    localStorage.setItem('accounts', JSON.stringify([...accounts, name]));
    signIn(name);
  }

  function signIn(as) {
    onLogin(as);
    navigate('/screener');
  }

  if (signedInAs) {
    return (
      <main id="login">
        <h2>Welcome back</h2>
        <p>
          You are signed in as <b>{signedInAs}</b>.
        </p>
        <div className="login-actions">
          <button className="btn btn-primary" type="button" onClick={() => navigate('/screener')}>
            Open the screener
          </button>
          <button className="btn btn-outline-light" type="button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </main>
    );
  }

  return (
    <main id="login">
      <h2>Welcome</h2>
      <p>Screen and rank companies on metrics you can see the formula for.</p>

      {/* The inputs have no name, so nothing typed here ends up in a URL. */}
      <form className="card" onSubmit={logIn}>
        <fieldset className="card-body">
          <legend className="card-title">Log in or create an account</legend>
          <p>
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              className="form-control"
              type="text"
              id="username"
              placeholder="your@email.com"
              required
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                setError('');
              }}
            />
          </p>
          <p>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-control"
              type="password"
              id="password"
              placeholder="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </p>
          {error && (
            <p className="alert alert-danger" role="alert">
              {error}
            </p>
          )}
          <div className="login-actions">
            <button className="btn btn-primary" type="submit" disabled={!name || !password}>
              Log in
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              disabled={!name || !password}
              onClick={createAccount}
            >
              Create account
            </button>
          </div>
          <button className="btn btn-link guest" type="button" onClick={() => signIn(guestName)}>
            Continue as guest
          </button>
        </fieldset>
      </form>
    </main>
  );
}

function readAccounts() {
  return JSON.parse(localStorage.getItem('accounts') ?? '[]');
}
