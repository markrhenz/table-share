// Admin endpoints — all gated by ADMIN_KEY secret.
// Pattern matches existing /analytics route. Query-string auth (?key=...).
//
// Endpoints:
//   GET  /api/admin/pending-emails  — list failed-email recovery records
//   GET  /api/admin/keys            — list issued Pro API keys (truncated for safety)
//   POST /api/admin/revoke          — mark a Pro key as revoked. Body: { apiKey }
//
// All return JSON. Mark accesses via curl, Postman, or browser (for GETs).

import { jsonResponse } from '../utils/headers.js';

function unauthorized() {
  return jsonResponse({ error: 'Unauthorized' }, 401);
}

function authorize(env, url) {
  const supplied = url.searchParams.get('key') || '';
  const expected = env.ADMIN_KEY || '';
  // Constant-time-ish: avoid early exit on length mismatch in user-supplied paths.
  if (!expected || supplied.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * GET /api/admin/pending-emails
 * Returns list of Pro keys that failed to email their owner.
 * These were generated successfully but the email send failed —
 * Mark must manually email these keys to recover the customer.
 */
export async function handleAdminPendingEmails(request, env, url) {
  if (!authorize(env, url)) return unauthorized();

  try {
    const listing = await env.TABLES.list({ prefix: 'pending_email:', limit: 1000 });
    const records = [];

    for (const k of listing.keys) {
      try {
        const raw = await env.TABLES.get(k.name);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        records.push({
          transactionId: k.name.replace('pending_email:', ''),
          apiKey: parsed.apiKey,
          email: parsed.email,
          reason: parsed.reason,
          createdAt: parsed.createdAt
        });
      } catch (innerErr) {
        records.push({ transactionId: k.name, error: 'parse_failed' });
      }
    }

    return jsonResponse({ count: records.length, records, truncated: !listing.list_complete });
  } catch (err) {
    console.error('handleAdminPendingEmails error:', err);
    return jsonResponse({ error: 'Internal error' }, 500);
  }
}

/**
 * GET /api/admin/keys
 * Returns a list of all Pro API keys. Key strings are TRUNCATED to first 16 chars
 * so a screenshot of the admin response can't be used to impersonate a customer.
 */
export async function handleAdminListKeys(request, env, url) {
  if (!authorize(env, url)) return unauthorized();

  try {
    const listing = await env.TABLES.list({ prefix: 'keys:', limit: 1000 });
    const records = [];

    for (const k of listing.keys) {
      try {
        const raw = await env.TABLES.get(k.name);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        const fullKey = k.name.replace('keys:', '');
        records.push({
          // Truncate so the response is not a credential dump:
          keyPreview: fullKey.substring(0, 16) + '...',
          tier: parsed.tier,
          email: parsed.email,
          createdAt: parsed.createdAt,
          revoked: parsed.revoked === true,
          revokedAt: parsed.revokedAt || null,
          transactionId: parsed.transactionId
        });
      } catch (innerErr) {
        records.push({ keyName: k.name, error: 'parse_failed' });
      }
    }

    return jsonResponse({ count: records.length, records, truncated: !listing.list_complete });
  } catch (err) {
    console.error('handleAdminListKeys error:', err);
    return jsonResponse({ error: 'Internal error' }, 500);
  }
}

/**
 * POST /api/admin/revoke
 * Body: { apiKey: "ts_live_xxx..." }
 * Marks the key as revoked. validateApiKey will treat it as invalid going forward.
 * Existing tables created by this key remain accessible (data is independent of key).
 */
export async function handleAdminRevokeKey(request, env, url) {
  if (!authorize(env, url)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch (parseErr) {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const apiKey = body && typeof body.apiKey === 'string' ? body.apiKey.trim() : '';
  if (!apiKey || !apiKey.startsWith('ts_live_') || apiKey.length < 16 || apiKey.length > 64) {
    return jsonResponse({ error: 'Invalid apiKey format' }, 400);
  }

  try {
    const kvKey = `keys:${apiKey}`;
    const raw = await env.TABLES.get(kvKey);
    if (!raw) {
      return jsonResponse({ error: 'Key not found' }, 404);
    }

    const parsed = JSON.parse(raw);
    if (parsed.revoked === true) {
      return jsonResponse({
        ok: true,
        message: 'Already revoked',
        revokedAt: parsed.revokedAt
      });
    }

    parsed.revoked = true;
    parsed.revokedAt = new Date().toISOString();

    await env.TABLES.put(kvKey, JSON.stringify(parsed));

    return jsonResponse({
      ok: true,
      message: 'Key revoked',
      revokedAt: parsed.revokedAt,
      email: parsed.email,
      transactionId: parsed.transactionId
    });
  } catch (err) {
    console.error('handleAdminRevokeKey error:', err);
    return jsonResponse({ error: 'Internal error' }, 500);
  }
}

// ── Phase 0: funnel readout from Analytics Engine (zero KV reads) ──
const AE_LOOKBACK_DAYS = 42; // the 6-week experiment window

async function aeQuery(env, sql) {
  const acct = env.CF_ACCOUNT_ID;
  const token = env.AE_SQL_TOKEN;
  if (!acct || !token) return { error: 'Missing CF_ACCOUNT_ID or AE_SQL_TOKEN secret' };
  try {
    const resp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${acct}/analytics_engine/sql`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' },
      body: sql
    });
    const text = await resp.text();
    if (!resp.ok) return { error: `AE SQL ${resp.status}: ${text.slice(0, 300)}` };
    return JSON.parse(text);
  } catch (e) {
    return { error: `AE query failed: ${(e && e.message || 'unknown').slice(0, 200)}` };
  }
}

/**
 * GET /api/admin/funnel?key=ADMIN_KEY
 * Returns the loop-vs-seed-vs-direct funnel for the experiment window.
 * Headline = the numbers the kill gate is judged on.
 */
export async function handleAdminFunnel(request, env, url) {
  if (!authorize(env, url)) return unauthorized();

  const d = AE_LOOKBACK_DAYS;
  const headlineSql =
    `SELECT count(DISTINCT if(blob1='create', index1, NULL)) AS distinct_creators, ` +
    `countIf(blob1='create') AS creates_total, ` +
    `countIf(blob1='create' AND blob2='loop') AS creates_loop, ` +
    `countIf(blob1='create' AND blob2 LIKE 'seed:%') AS creates_seed, ` +
    `countIf(blob1='create' AND blob2='direct') AS creates_direct, ` +
    `countIf(blob1='view') AS views_total, ` +
    `count(DISTINCT if(blob1='view', index1, NULL)) AS distinct_tables_viewed ` +
    `FROM table_share_events WHERE timestamp > NOW() - INTERVAL '${d}' DAY`;
  const breakdownSql =
    `SELECT blob1 AS event, blob2 AS source, count() AS events, count(DISTINCT index1) AS distinct_ids ` +
    `FROM table_share_events WHERE timestamp > NOW() - INTERVAL '${d}' DAY ` +
    `GROUP BY event, source ORDER BY event, events DESC`;

  const [headline, breakdown] = await Promise.all([
    aeQuery(env, headlineSql),
    aeQuery(env, breakdownSql)
  ]);

  return jsonResponse({
    lookbackDays: d,
    headline: headline.data ? headline.data[0] : headline,
    breakdown: breakdown.data || breakdown,
    gate: {
      survival_floor: '>=30 distinct_creators in week 6',
      loop_bar: '>=10 cumulative creates_loop + rising trend + /t/->create rate >=3%',
      void_if: 'views_total < ~200 over 6 weeks (undersampled, not failed)'
    }
  });
}
