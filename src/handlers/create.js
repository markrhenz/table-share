import { validateApiKey } from '../utils/api-key.js';
import { TIER_LIMITS } from '../utils/sanitizer.js';
import { generateUniqueId } from '../utils/id-generator.js';
import { validateInput, sanitizeCell, detectMaliciousContent } from '../utils/sanitizer.js';
import { checkRateLimit } from '../utils/rate-limiter.js';
import { incrementMetric } from '../utils/analytics.js';

export async function handleCreate(request, env) {
  try {
    // 1. Extract IP
    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

    // 2. Check rate limit
    const rateCheck = await checkRateLimit(env.TABLES, ip, 5);
    if (!rateCheck.allowed) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. Parse body
    const { data, title, honeypot, apiKey, password, expiry, noBranding } = await request.json();
    
    // Validate API key and determine tier
    const { valid: isProUser, tier } = await validateApiKey(apiKey, env.TABLES);

    // 4. Validate and set expiry
    let finalExpiry = 2592000; // Default 30 days
    if (expiry) {
      const requestedExpiry = parseInt(expiry);
      if (tier === 'pro') {
        // Pro users can choose 1h to 90 days
        if (requestedExpiry >= 3600 && requestedExpiry <= 7776000) {
          finalExpiry = requestedExpiry;
        }
      } else {
        // Free users forced to 30 days max
        finalExpiry = Math.min(requestedExpiry, 2592000);
      }
    }

    // 5. Honeypot check
    if (honeypot) {
      return new Response(JSON.stringify({ error: 'Invalid submission' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 6. Validate input
    const validation = validateInput(data, tier);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 7. Sanitize all cells
    const sanitizedData = data.map(row => row.map(cell => sanitizeCell(cell)));

    // 8. Normalize rows to uniform length
    const maxCols = Math.max(...sanitizedData.map(row => row.length));
    sanitizedData.forEach(row => {
      while (row.length < maxCols) row.push("");
    });

    // 9. Check malicious content in all cells
    for (const row of sanitizedData) {
      for (const cell of row) {
        if (detectMaliciousContent(cell)) {
          return new Response(JSON.stringify({ error: 'Invalid content' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }

    // 8. Hash password if provided
    let passwordHash = null;
    if (password && password.trim()) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password.trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // 10. Generate ID
    const id = await generateUniqueId(env.TABLES);

    // 11. Store in KV
    const tableData = {
       data: sanitizedData,
       title: title || null,
       createdAt: new Date().toISOString(),
       rowCount: sanitizedData.length,
       colCount: maxCols,
       passwordHash: passwordHash,
       noBranding: noBranding || false
     };
    await env.TABLES.put(id, JSON.stringify(tableData), { expirationTtl: finalExpiry });

    // Track analytics (fail silently, don't block user)
    try {
      await incrementMetric(env.TABLES, 'tables_created');
      if (tier === 'pro') {
        await incrementMetric(env.TABLES, 'pro_tables');
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
      // Don't throw - analytics failure shouldn't break table creation
    }

    // 11. Return success
    const url = `${new URL(request.url).origin}/t/${id}`;
    return new Response(JSON.stringify({
      id,
      url,
      passwordProtected: !!passwordHash
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}