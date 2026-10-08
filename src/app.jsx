import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className="app">
      <header>
        <img src="/logo.svg" alt="Axon Trading House logo" width="48" height="48" />
        <h1>Axon Trading House</h1>
      </header>

      <main>App components go here</main>

      <footer>
        <p>Isaac Downs</p>
        <a href="https://github.com/isaac-downs-3/startup">GitHub</a>
      </footer>
    </div>
  );
}
