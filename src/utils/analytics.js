/**
 * Increment a daily analytics counter
 * Also bumps the lifetime total counter for that metric (single-key, O(1) reads).
 * @param {KVNamespace} kv - Cloudflare KV namespace
 * @param {string} metric - Metric name (e.g., 'tables_created', 'views', 'pro_conversions')
 * @returns {Promise<number>} Updated daily count
 */
export async function incrementMetric(kv, metric) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const key = `stats:${metric}:${today}`;

  try {
    // Get current count
    const current = await kv.get(key);
    const count = current ? parseInt(current) : 0;

    // Increment and store with 30-day TTL
    const newCount = count + 1;
    await kv.put(key, String(newCount), { expirationTtl: 2592000 }); // 30 days

    // Also bump lifetime counter (single key, no TTL) — fire-and-forget so a failure
    // here never blocks the user flow. Used by /api/stats for fast homepage display.
    incrementLifetimeTotal(kv, metric).catch(() => { /* swallow */ });

    return newCount;
  } catch (error) {
    console.error('Analytics error:', error);
    return 0; // Fail silently, don't break user flow
  }
}

/**
 * Bump the lifetime total for a metric. Single KV key, no TTL.
 * Read by /api/stats in O(1) — no 365-day loop.
 * @param {KVNamespace} kv
 * @param {string} metric
 * @returns {Promise<number>} New lifetime total
 */
export async function incrementLifetimeTotal(kv, metric) {
  const key = `stats:lifetime:${metric}`;
  try {
    const current = await kv.get(key);
    const count = current ? parseInt(current) : 0;
    const newCount = count + 1;
    await kv.put(key, String(newCount)); // no TTL — persists forever
    return newCount;
  } catch (error) {
    console.error('Lifetime metric error:', error);
    return 0;
  }
}

/**
 * Get the lifetime total for a metric in O(1).
 * If the key doesn't exist yet (not seeded), returns null so callers can decide
 * whether to backfill from the daily counters.
 * @param {KVNamespace} kv
 * @param {string} metric
 * @returns {Promise<number|null>} Lifetime total, or null if never written.
 */
export async function getLifetimeTotal(kv, metric) {
  try {
    const raw = await kv.get(`stats:lifetime:${metric}`);
    if (raw === null || raw === undefined) return null;
    const n = parseInt(raw);
    return isNaN(n) ? 0 : n;
  } catch (error) {
    return null;
  }
}

/**
 * Set the lifetime total explicitly. Used by lazy backfill on first /api/stats call.
 * @param {KVNamespace} kv
 * @param {string} metric
 * @param {number} value
 */
export async function setLifetimeTotal(kv, metric, value) {
  try {
    await kv.put(`stats:lifetime:${metric}`, String(value));
  } catch (error) {
    console.error('setLifetimeTotal error:', error);
  }
}

/**
 * Get analytics for a specific metric and date range
 * @param {KVNamespace} kv - Cloudflare KV namespace
 * @param {string} metric - Metric name
 * @param {number} days - Number of days to retrieve (default 30)
 * @returns {Promise<Object>} {date: count} pairs
 */
export async function getMetrics(kv, metric, days = 30) {
  const results = {};
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const key = `stats:${metric}:${dateStr}`;

    try {
      const value = await kv.get(key);
      results[dateStr] = value ? parseInt(value) : 0;
    } catch (error) {
      results[dateStr] = 0;
    }
  }

  return results;
}

/**
 * Get total count for a metric over date range
 * @param {KVNamespace} kv - Cloudflare KV namespace
 * @param {string} metric - Metric name
 * @param {number} days - Number of days (default 30)
 * @returns {Promise<number>} Total count
 */
export async function getTotalMetric(kv, metric, days = 30) {
  const metrics = await getMetrics(kv, metric, days);
  return Object.values(metrics).reduce((sum, count) => sum + count, 0);
}
