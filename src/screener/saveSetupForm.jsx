import React from 'react';
import { NavLink } from 'react-router-dom';

// Save the current setup under a name. Saving under a name already in use
// replaces that setup.
export function SaveSetupForm({ onSave }) {
  const [name, setName] = React.useState('');
  const [saved, setSaved] = React.useState(null);

  async function save(event) {
    event.preventDefault();
    setSaved(await onSave(name.trim()));
    setName('');
  }

  return (
    <form className="save-setup" onSubmit={save}>
      <div className="input-group">
        <label className="input-group-text" htmlFor="setup-name">
          Save setup as
        </label>
        <input
          className="form-control"
          type="text"
          id="setup-name"
          placeholder="e.g. Cash rich"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={!name.trim()}>
          Save
        </button>
      </div>
      {saved && (
        <p className="save-message" role="status">
          {saved.replaced ? 'Replaced' : 'Saved'} &ldquo;{saved.name}&rdquo;. Open it any time from your{' '}
          <NavLink to="/watchlist">Watchlist</NavLink>.
        </p>
      )}
    </form>
  );
}
