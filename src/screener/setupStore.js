import { defaultSetup } from './screenerData';

// Each user's screener setup is kept in localStorage until the database
// deliverable, so the screener opens the way they left it.
const keyFor = (userName) => `screenerSetup.${userName}`;

export function readSetup(userName) {
  return { ...defaultSetup, ...JSON.parse(localStorage.getItem(keyFor(userName)) ?? '{}') };
}

export function saveSetup(userName, setup) {
  localStorage.setItem(keyFor(userName), JSON.stringify(setup));
}
