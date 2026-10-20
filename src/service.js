// Mocked service calls. Each one resolves to what its endpoint will return in
// the service deliverable, so only these function bodies change then.
import { metrics } from './metrics/metricsData';

// GET /api/metrics
export async function getMetrics() {
  return metrics;
}
