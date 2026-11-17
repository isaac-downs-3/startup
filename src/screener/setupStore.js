import { getScreenerSetup, saveScreenerSetup } from '../service';

// The setup a new user starts with: which metrics are columns, and how the
// companies are sorted and shown.
export const defaultSetup = {
  columns: ['eps_ttm', 'net_margin', 'net_margin_pct', 'revenue_yoy', 'fcf_margin', 'pe', 'pe_pct'],
  sort: 'net_margin',
  order: 'desc',
  view: 'values',
};

// Each user's current screener setup is saved to their account in the database,
// so the screener opens the way they left it on any device. Named setups are saved
// with the watchlist.
export async function readSetup() {
  return { ...defaultSetup, ...(await getScreenerSetup()) };
}

export function saveSetup(setup) {
  return saveScreenerSetup(setup);
}
