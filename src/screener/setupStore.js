// The setup a new user starts with: which metrics are columns, and how the
// companies are sorted and shown.
const defaultSetup = {
  columns: ['eps_ttm', 'net_margin', 'net_margin_pct', 'revenue_yoy', 'fcf_margin', 'pe', 'pe_pct'],
  sort: 'net_margin',
  order: 'desc',
  view: 'values',
};

// Each user's current screener setup is kept in localStorage until the database
// deliverable, so the screener opens the way they left it. Named setups are saved
// through the service.
const keyFor = (userName) => `screenerSetup.${userName}`;

export function readSetup(userName) {
  return { ...defaultSetup, ...JSON.parse(localStorage.getItem(keyFor(userName)) ?? '{}') };
}

export function saveSetup(userName, setup) {
  localStorage.setItem(keyFor(userName), JSON.stringify(setup));
}
