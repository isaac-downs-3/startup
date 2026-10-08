import React from 'react';
import { NavLink } from 'react-router-dom';

export function Login() {
  return (
    <main id="login">
      <h2>Welcome</h2>
      <p>Screen and rank companies on metrics you can see the formula for.</p>

      {/* Login is mocked for now: both buttons go straight to the screener.
          The inputs have no name, so nothing typed here ends up in a URL. */}
      <form className="card">
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
            <NavLink className="btn btn-primary" to="/screener">
              Log in
            </NavLink>
            <NavLink className="btn btn-outline-light" to="/screener">
              Create account
            </NavLink>
          </div>
        </fieldset>
      </form>
    </main>
  );
}
