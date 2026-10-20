import React from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

export function Login({ onLogin }) {
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
    signIn();
  }

  function createAccount() {
    const accounts = readAccounts();
    if (accounts.includes(name)) {
      setError(`${name} already has an account. Log in instead.`);
      return;
    }
    localStorage.setItem('accounts', JSON.stringify([...accounts, name]));
    signIn();
  }

  function signIn() {
    onLogin(name);
    navigate('/screener');
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
        </fieldset>
      </form>
    </main>
  );
}

function readAccounts() {
  return JSON.parse(localStorage.getItem('accounts') ?? '[]');
}
