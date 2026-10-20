// Display a metric value in its unit, e.g. 0.558 as a ratio -> '55.8%'.
export function formatValue(value, unit) {
  const sign = value < 0 ? '-' : '';
  const size = Math.abs(value);

  switch (unit) {
    case 'currency per share':
      return `${sign}$${size.toFixed(2)}`;
    case 'currency':
      return `${sign}$${compact(size)}`;
    case 'ratio':
      // Small ratios such as dividend yields need a second decimal to show at all.
      return `${(value * 100).toFixed(size < 0.01 ? 2 : 1)}%`;
    case 'percentile':
      return value.toFixed(2);
    case 'rank':
      return String(value);
    case 'multiple':
      return `${value.toFixed(size < 10 ? 2 : 1)}×`;
    default:
      return String(value);
  }
}

// Three significant figures: 3020000000000 -> '3.02T', 655000000000 -> '655B'.
function compact(size) {
  if (size >= 1e12) return `${(size / 1e12).toPrecision(3)}T`;
  if (size >= 1e9) return `${(size / 1e9).toPrecision(3)}B`;
  if (size >= 1e6) return `${(size / 1e6).toPrecision(3)}M`;
  return size.toFixed(0);
}
