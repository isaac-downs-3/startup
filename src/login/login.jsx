import React from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  // Login is mocked for now: once the browser's required-field check passes,
  // go to the screener. Real authentication replaces this in the service
  // deliverable.
  function handleSubmit(event) {
    event.preventDefault();
    navigate('/screener');
  }

  return (
    <main id="login">
      <h2>Welcome</h2>
      <p>Screen and rank companies on metrics you can see the formula for.</p>

      {/* The inputs have no name, so nothing typed here ends up in a URL. */}
      <form className="card" onSubmit={handleSubmit}>
        <fieldset className="card-body">
          <legend className="card-title">Log in or create an account</legend>
          <p>
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input className="form-control" type="text" id="username" placeholder="your@email.com" required />
          </p>
          <p>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input className="form-control" type="password" id="password" placeholder="password" required />
          </p>
          <div className="login-actions">
            <button className="btn btn-primary" type="submit">
              Log in
            </button>
            <button className="btn btn-outline-light" type="submit">
              Create account
            </button>
          </div>
        </fieldset>
      </form>
    </main>
  );
}
