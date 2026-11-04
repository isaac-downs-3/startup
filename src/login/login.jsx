import React from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, startGuestSession } from '../service';

export function Login({ signedInAs, onLogin, onLogout }) {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const canSubmit = email.trim() && password;

  // Run a sign-in call. On success go to the screener; otherwise show why it failed.
  async function signIn(call) {
    try {
      const user = await call();
      onLogin(user.email);
      navigate('/screener');
    } catch (err) {
      setError(err.message);
    }
  }

  function logIn(event) {
    event.preventDefault();
    signIn(() => loginUser(email, password));
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
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              className="form-control"
              type="email"
              id="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
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
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
          </p>
          {error && (
            <p className="alert alert-danger" role="alert">
              {error}
            </p>
          )}
          <div className="login-actions">
            <button className="btn btn-primary" type="submit" disabled={!canSubmit}>
              Log in
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              disabled={!canSubmit}
              onClick={() => signIn(() => registerUser(email, password))}
            >
              Create account
            </button>
          </div>
          <button className="btn btn-link guest" type="button" onClick={() => signIn(startGuestSession)}>
            Continue as guest
          </button>
        </fieldset>
      </form>
    </main>
  );
}
