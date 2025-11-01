/**
 * Increment a daily analytics counter
 * @param {KVNamespace} kv - Cloudflare KV namespace
 * @param {string} metric - Metric name (e.g., 'tables_created', 'views', 'pro_conversions')
 * @returns {Promise<number>} Updated count
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

    return newCount;
  } catch (error) {
    console.error('Analytics error:', error);
    return 0; // Fail silently, don't break user flow
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