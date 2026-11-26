/**
 * Workers Analytics Engine helper — the Phase 0 measurement backbone.
 *
 * WHY: writeDataPoint() costs ZERO against the KV quota (separate free metric),
 * so view/create telemetry never touches the 1,000 writes/day KV ceiling.
 * Verified free (not yet billed) as of 2026-06. Data retained ~3 months.
 *
 * Binding: env.AE  (see wrangler.toml [[analytics_engine_datasets]]).
 * Safe no-op if AE is unbound (local `wrangler dev` without the binding).
 *
 * EVENT SCHEMA (blob1 = event type):
 *   view:   blob1='view'   blob2=referrerHost  blob3=landingParam              index1=tableId
 *   create: blob1='create' blob2=source        blob3=originTableId
 *           blob4=newTableId  blob5=tier                                       index1=creatorId
 *     source ∈ { 'loop', 'seed:<utm>', 'direct' }
 *
 * Distinct creators  = SELECT count(DISTINCT index1) WHERE blob1='create'
 * Loop creates       = ... WHERE blob1='create' AND blob2='loop'
 * Share→create funnel: compare count() WHERE blob1='view'  vs  blob1='create' AND blob2='loop'
 */

/** Extract a short hostname from a Referer header (for channel attribution). */
export function hostFromReferer(ref) {
  if (!ref) return '';
  try { return new URL(ref).hostname.slice(0, 64); } catch { return ''; }
}

function write(env, point) {
  try {
    if (env && env.AE && typeof env.AE.writeDataPoint === 'function') {
      env.AE.writeDataPoint(point); // synchronous, fire-and-forget — adds no latency
    }
  } catch (e) {
    console.error('AE write failed:', e && e.message);
  }
}

export function logView(env, { tableId, referrerHost = '', landingParam = '' }) {
  write(env, {
    blobs: ['view', String(referrerHost).slice(0, 64), String(landingParam).slice(0, 64)],
    indexes: [String(tableId || '').slice(0, 96)]
  });
}

export function logCreate(env, { source = 'direct', originTableId = '', newTableId = '', tier = 'free', creatorId = '' }) {
  write(env, {
    blobs: ['create', String(source).slice(0, 64), String(originTableId).slice(0, 16),
      String(newTableId).slice(0, 16), String(tier).slice(0, 16)],
    indexes: [String(creatorId || '').slice(0, 96)]
  });
}
