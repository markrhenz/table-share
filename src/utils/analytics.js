/**
 * Increment a daily analytics counter.
 *
 * KV WRITE COST: 1 write, plus 1 more if bumpLifetime is true. The Workers free
 * plan allows 1,000 KV writes/day total, so every call here is charged against
 * the same budget that table creation needs. Only bump the lifetime counter for
 * metrics something actually READS — right now that is 'tables_created' only
 * (see handleStats). Lifetime counters for table_views / pro_tables / url_fetched
 * were write-only dead weight.
 *
 * @param {KVNamespace} kv - Cloudflare KV namespace
 * @param {string} metric - Metric name (e.g., 'tables_created', 'table_views')
 * @param {Object} [options]
 * @param {boolean} [options.bumpLifetime=true] - Also bump stats:lifetime:{metric}
 * @returns {Promise<number>} Updated daily count
 */
export async function incrementMetric(kv, metric, options = {}) {
  const { bumpLifetime = true } = options;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const key = `stats:${metric}:${today}`;

  try {
    // Get current count
    const current = await kv.get(key);
    const count = current ? parseInt(current) : 0;

    // Increment and store with 30-day TTL
    const newCount = count + 1;
    await kv.put(key, String(newCount), { expirationTtl: 2592000 }); // 30 days

    // Bump the lifetime counter. MUST be awaited.
    //
    // This was previously fire-and-forget:
    //     incrementLifetimeTotal(kv, metric).catch(() => {});
    // Cloudflare Workers cancels pending async work as soon as the response is
    // returned, so the get+put never completed and stats:lifetime:tables_created
    // never incremented in production — it sat frozen at whatever the one-time
    // backfill wrote. Confirmed live 2026-09-06: 4 creates moved the daily counter
    // 220->224 while lifetime stayed at 220 across a 95s propagation window.
    //
    // ctx.waitUntil() would be the lower-latency fix, but handleCreate never
    // receives ctx (index.js doesn't thread it), so await is the honest option.
    // incrementLifetimeTotal has its own try/catch and cannot throw, and the
    // daily put above has already succeeded by this point.
    if (bumpLifetime) {
      await incrementLifetimeTotal(kv, metric);
    }

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
