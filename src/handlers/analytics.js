import { getMetrics, getTotalMetric, getLifetimeTotal, setLifetimeTotal } from '../utils/analytics.js';
import { corsHeaders } from '../utils/headers.js';

export async function handleAnalytics(request, env, url) {
  const adminKey = url.searchParams.get('key');
  const ADMIN_KEY = env.ADMIN_KEY;

  if (adminKey !== ADMIN_KEY) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'Content-Type': 'text/plain', ...corsHeaders }
    });
  }

  try {
    // Fetch all metrics for last 30 days
    const tablesCreated = await getMetrics(env.TABLES, 'tables_created', 30);
    const views = await getMetrics(env.TABLES, 'table_views', 30);
    const proTables = await getMetrics(env.TABLES, 'pro_tables', 30);

    // Calculate totals
    const totalTables = Object.values(tablesCreated).reduce((a, b) => a + b, 0);
    const totalViews = Object.values(views).reduce((a, b) => a + b, 0);
    const totalPro = Object.values(proTables).reduce((a, b) => a + b, 0);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analytics - Table Share</title>
  <style>
    :root {
      --bg: #fff;
      --text: #000;
      --border: #000;
      --table-bg: #f5f5f5;
    }
    body {
      font-family: 'Courier New', monospace;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
      background: var(--bg);
      color: var(--text);
    }
    h1 {
      margin-bottom: 10px;
      font-size: 28px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }
    .stat-card {
      border: 2px solid var(--border);
      padding: 20px;
      background: var(--table-bg);
    }
    .stat-card h2 {
      margin: 0 0 10px 0;
      font-size: 16px;
      font-weight: normal;
    }
    .stat-card .number {
      font-size: 48px;
      font-weight: bold;
      margin: 0;
    }
    .metric {
      margin: 40px 0;
    }
    .metric h2 {
      margin-bottom: 15px;
      font-size: 20px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      border: 2px solid var(--border);
    }
    th, td {
      border: 1px solid var(--border);
      padding: 10px;
      text-align: left;
    }
    th {
      background: var(--table-bg);
      font-weight: bold;
    }
    tr:nth-child(even) {
      background: rgba(0, 0, 0, 0.02);
    }
    .chart {
      margin-top: 10px;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <h1>📊 Table Share Analytics</h1>
  <p>Last 30 days • Updated in real-time</p>

  <div class="summary">
    <div class="stat-card">
      <h2>Total Tables Created</h2>
      <p class="number">${totalTables}</p>
    </div>
    <div class="stat-card">
      <h2>Total Views</h2>
      <p class="number">${totalViews}</p>
    </div>
    <div class="stat-card">
      <h2>Pro Tables Created</h2>
      <p class="number">${totalPro}</p>
    </div>
    <div class="stat-card">
      <h2>Conversion Rate</h2>
      <p class="number">${totalTables > 0 ? ((totalPro / totalTables) * 100).toFixed(1) : 0}%</p>
    </div>
  </div>

  <div class="metric">
    <h2>📈 Tables Created (Daily)</h2>
    <table>
      <thead>
        <tr><th>Date</th><th>Count</th><th>Chart</th></tr>
      </thead>
      <tbody>
        ${Object.entries(tablesCreated)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, count]) => {
      const bar = '█'.repeat(Math.max(1, Math.floor(count / 5)));
      return `<tr><td>${date}</td><td><strong>${count}</strong></td><td class="chart">${bar}</td></tr>`;
    })
    .join('')}
      </tbody>
    </table>
  </div>

  <div class="metric">
    <h2>👁️ Table Views (Daily)</h2>
    <table>
      <thead>
        <tr><th>Date</th><th>Count</th><th>Chart</th></tr>
      </thead>
      <tbody>
        ${Object.entries(views)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, count]) => {
      const bar = '█'.repeat(Math.max(1, Math.floor(count / 10)));
      return `<tr><td>${date}</td><td><strong>${count}</strong></td><td class="chart">${bar}</td></tr>`;
    })
    .join('')}
      </tbody>
    </table>
  </div>

  <div class="metric">
    <h2>⭐ Pro Tables (Daily)</h2>
    <table>
      <thead>
        <tr><th>Date</th><th>Count</th><th>Chart</th></tr>
      </thead>
      <tbody>
        ${Object.entries(proTables)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, count]) => {
      const bar = '█'.repeat(Math.max(count > 0 ? 1 : 0, Math.floor(count / 2)));
      return `<tr><td>${date}</td><td><strong>${count}</strong></td><td class="chart">${bar || '-'}</td></tr>`;
    })
    .join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html', ...corsHeaders }
    });
  } catch (error) {
    console.error('Analytics error:', error.message, error.stack);
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain', ...corsHeaders }
    });
  }
}

/**
 * Public homepage stats endpoint.
 *
 * FAST PATH: read a single lifetime counter (O(1), one KV read).
 * BACKFILL PATH: if the counter has never been written (first call after deploy),
 *   compute it once from the 365-day daily counters, persist, and return it.
 *   All subsequent calls hit the fast path.
 *
 * Response: { total: <number> }
 * Heavy edge caching (5 min) — protects KV read budget.
 */
export async function handleStats(env) {
  try {
    // Fast path — single KV read
    let total = await getLifetimeTotal(env.TABLES, 'tables_created');

    // Backfill path — only runs once, on the first request after this code ships.
    if (total === null) {
      try {
        total = await getTotalMetric(env.TABLES, 'tables_created', 365);
        await setLifetimeTotal(env.TABLES, 'tables_created', total);
      } catch (backfillErr) {
        console.error('Lifetime backfill failed:', backfillErr);
        total = 0;
      }
    }

    return new Response(JSON.stringify({ total: total || 0 }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=3600',
        ...corsHeaders
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ total: 0 }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
}
