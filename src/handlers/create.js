import { jsonResponse, corsHeaders } from '../utils/headers.js';
import { validateApiKey } from '../utils/api-key.js';
import { generateUniqueId } from '../utils/id-generator.js';
import { validateInput, sanitizeCell, detectMaliciousContent, escapeHtml, TIER_LIMITS } from '../utils/sanitizer.js';
import { checkRateLimit } from '../utils/rate-limiter.js';
import { incrementMetric } from '../utils/analytics.js';
import { hashPassword } from '../utils/password.js';
import { logCreate } from '../utils/ae.js';

// Phase 0: stable per-browser creator id (cookie only — NO KV write).
function getOrMakeCid(request) {
  const cookie = request.headers.get('Cookie') || '';
  const m = cookie.match(/(?:^|;\s*)ts_cid=([a-zA-Z0-9]+)/);
  if (m) return { cid: m[1], isNew: false };
  return { cid: crypto.randomUUID().replaceAll('-', ''), isNew: true };
}

export async function handleCreate(request, env) {
  try {
    // 1. Extract IP
    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

    // 2. Check rate limit
    const rateCheck = await checkRateLimit(env.TABLES, ip, 5);
    if (!rateCheck.allowed) {
      return jsonResponse({ error: 'Too many requests' }, 429);
    }

    // 3. Parse body
    const { data, title, honeypot, apiKey, password, expiry, noBranding, noHeaders, src, utm } = await request.json();

    // Phase 0 attribution: loop (came from a shared /t/ link) > seed (utm) > direct
    let source = 'direct';
    if (src) source = 'loop';
    else if (utm) source = `seed:${String(utm).slice(0, 32)}`;
    const { cid, isNew: isNewCid } = getOrMakeCid(request);

    // 3.1. Sanitize title to prevent XSS
    const sanitizedTitle = title ? escapeHtml(title.trim().substring(0, 100)) : null;

    // 4. Validate API key
    const { valid: isProUser, tier } = await validateApiKey(apiKey, env.TABLES, env);

    // 5. Validate and set expiry
    let finalExpiry = 604800; // Default 7 days (FREE tier)
    if (tier === 'owner') {
      // Owner gets 10 years
      finalExpiry = 315360000;
    } else if (expiry) {
      // parseInt('abc') is NaN. Math.min(NaN, ...) is NaN, which makes KV's
      // expirationTtl throw and turns a bad request into a 500. Guard first.
      // KV also rejects any TTL under 60s, so the floor stays at 3600.
      const requestedExpiry = parseInt(expiry, 10);
      if (Number.isFinite(requestedExpiry) && requestedExpiry >= 3600) {
        if (tier === 'pro') {
          // Pro users can choose 1h to 90 days
          if (requestedExpiry <= 7776000) {
            finalExpiry = requestedExpiry;
          }
        } else {
          // Free users forced to 7 days max
          finalExpiry = Math.min(requestedExpiry, 604800);
        }
      }
    }

    // 6. Honeypot check
    if (honeypot) {
      return jsonResponse({ error: 'Invalid submission' }, 400);
    }

    // 7. Validate input
    const validation = validateInput(data, tier);
    if (!validation.valid) {
      return jsonResponse({ error: validation.error }, 400);
    }

    // 8. Check malicious content on RAW data FIRST
    for (const row of data) {
      for (const cell of row) {
        if (detectMaliciousContent(String(cell || ''))) {
          return jsonResponse({ error: 'Invalid content detected' }, 400);
        }
      }
    }

    // 9. THEN sanitize all cells
    const sanitizedData = data.map(row => row.map(cell => sanitizeCell(cell)));

    // 10. Normalize rows to uniform length
    const maxCols = Math.max(...sanitizedData.map(row => row.length));
    sanitizedData.forEach(row => {
      while (row.length < maxCols) row.push('');
    });

    // 11. Post-sanitization size check
    const sanitizedJsonSize = JSON.stringify(sanitizedData).length;
    const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;
    if (sanitizedJsonSize > limits.maxSize) {
      return jsonResponse({ error: 'Data too large after processing (max 5MB). Try fewer special characters or smaller dataset.' }, 400);
    }

    // 12. Hash password if provided (PBKDF2 + per-table salt)
    // Pro-gated. The UI advertises password protection as a Pro feature but the
    // server used to hash any supplied password regardless of tier, so a direct
    // POST to /api/create got it for free. Fail loudly rather than silently
    // dropping it — a client that sent a password must not believe the table is
    // protected when it isn't.
    let passwordHash = null;
    let passwordSalt = null;
    let passwordKdf = null;
    if (password && password.trim()) {
      if (tier !== 'pro' && tier !== 'owner') {
        return jsonResponse({
          error: 'Password protection is a Pro feature. <a href="/pricing">Upgrade to Pro</a>'
        }, 403);
      }
      const hashed = await hashPassword(password.trim());
      passwordHash = hashed.hash;
      passwordSalt = hashed.salt;
      passwordKdf = hashed.kdf;
    }

    // 13. Generate ID
    const id = await generateUniqueId(env.TABLES);

    // 14. Store in KV
     const tableData = {
      data: sanitizedData,
      title: sanitizedTitle,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + finalExpiry * 1000).toISOString(),
      rowCount: sanitizedData.length,
      colCount: maxCols,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      passwordKdf: passwordKdf,
      // Pro-gated: an ungated flag lets any caller strip the /?s= footer, which is
      // the only organic growth surface in the product.
      noBranding: (tier === 'pro' || tier === 'owner') ? (noBranding || false) : false,
      noHeaders: noHeaders || false,
      tier: tier
    };
    await env.TABLES.put(id, JSON.stringify(tableData), { expirationTtl: finalExpiry });

    // 15. Track analytics
    // Track analytics (fail silently, don't block user)
    // pro_tables has no lifetime reader — skip that write (see utils/analytics.js).
    try {
      await incrementMetric(env.TABLES, 'tables_created');
      if (tier === 'pro') {
        await incrementMetric(env.TABLES, 'pro_tables', { bumpLifetime: false });
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
      // Don't throw - analytics failure shouldn't break table creation
    }

    // 15b. Log create event to Analytics Engine (zero KV cost)
    logCreate(env, {
      source,
      originTableId: src ? String(src).slice(0, 16) : '',
      newTableId: id,
      tier,
      creatorId: cid
    });

    // 16. Return success (set creator-id cookie on first create — header only, no KV)
    const url = `${new URL(request.url).origin}/t/${id}`;
    const successHeaders = { 'Content-Type': 'application/json', ...corsHeaders };
    if (isNewCid) {
      successHeaders['Set-Cookie'] = `ts_cid=${cid}; Max-Age=63072000; Path=/; SameSite=Lax; Secure; HttpOnly`;
    }
    return new Response(JSON.stringify({ id, url, passwordProtected: !!passwordHash }), {
      status: 201,
      headers: successHeaders
    });

  } catch (error) {
    console.error('handleCreate error:', error && error.message, error && error.stack);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
