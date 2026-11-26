import { jsonResponse } from '../utils/headers.js';
import { validateApiKey } from '../utils/api-key.js';
import { validateURL } from '../utils/url-validator.js';
import { checkRateLimit } from '../utils/rate-limiter.js';
import { validateInput, sanitizeCell, detectMaliciousContent, escapeHtml, TIER_LIMITS } from '../utils/sanitizer.js';
import { generateUniqueId } from '../utils/id-generator.js';
import { incrementMetric } from '../utils/analytics.js';
import { hashPassword } from '../utils/password.js';

export async function handleFetchURL(request, env) {
  try {
    // Step 1 - Extract IP
    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

    // Step 2 - Parse request body with try/catch
    let url, apiKey, title, password, expiry, noBranding, noHeaders;
    try {
      ({ url, apiKey, title, password, expiry, noBranding, noHeaders } = await request.json());
    } catch (parseError) {
      return jsonResponse({ error: 'Invalid request body' }, 400);
    }

    // Step 3 - Validate API key (PRO GATE)
    const { valid: isProUser, tier } = await validateApiKey(apiKey, env.TABLES, env);
    if (tier !== 'pro' && tier !== 'owner') {
      return jsonResponse({ error: 'URL fetching requires a Pro API key', upgradeUrl: '/pricing' }, 403);
    }

    // Step 4 - Rate limit (STRICTER than paste - 10 per hour, not 5 per minute)
    const rateLimitKey = 'url-fetch:' + ip;
    const hourMinute = Math.floor(Date.now() / 3600000); // per-hour bucket
    const rlKey = 'rate-limit:' + rateLimitKey + ':' + hourMinute;
    const countStr = await env.TABLES.get(rlKey);
    const count = countStr ? parseInt(countStr, 10) : 0;
    if (count >= 10) {
      return jsonResponse({ error: 'URL fetch rate limit: max 10 per hour' }, 429);
    }
    await env.TABLES.put(rlKey, String(count + 1), { expirationTtl: 3600 });

    // Step 5 - Validate URL is provided
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return jsonResponse({ error: 'URL is required' }, 400);
    }

    // Step 6 - Validate URL with SSRF checks
    const urlValidation = validateURL(url.trim());
    if (!urlValidation.valid) {
      return jsonResponse({ error: urlValidation.error }, 400);
    }

    // Step 7 - Fetch the URL with timeout and NO redirects. Wrap in try/catch
    let csvText;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const fetchResponse = await fetch(url.trim(), {
        method: 'GET',
        signal: controller.signal,
        redirect: 'manual',
        headers: {
          'User-Agent': 'TableShare/1.0 (https://table-share.org)',
          'Accept': 'text/csv, text/plain, text/tab-separated-values, */*'
        }
      });

      clearTimeout(timeoutId);

      // Block redirects (SSRF vector)
      if (fetchResponse.status >= 300 && fetchResponse.status < 400) {
        return jsonResponse({ error: 'URL redirects are not allowed for security' }, 400);
      }

      if (!fetchResponse.ok) {
        return jsonResponse({ error: 'URL returned HTTP ' + fetchResponse.status }, 400);
      }

      // Check content-type (allow csv, text, plain, tsv, octet-stream)
      const contentType = (fetchResponse.headers.get('content-type') || '').toLowerCase();
      const allowedTypes = ['csv', 'text', 'plain', 'tab-separated', 'octet-stream'];
      const typeOk = allowedTypes.some(t => contentType.includes(t));
      if (!typeOk && contentType !== '') {
        return jsonResponse({ error: 'URL does not return CSV/text data (got: ' + contentType.split(';')[0] + ')' }, 400);
      }

      // Check Content-Length if available
      const contentLength = fetchResponse.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 5242880) {
        return jsonResponse({ error: 'File too large (max 5MB)' }, 413);
      }

      csvText = await fetchResponse.text();

      if (csvText.length > 5242880) {
        return jsonResponse({ error: 'File too large (max 5MB)' }, 413);
      }

      if (csvText.trim().length === 0) {
        return jsonResponse({ error: 'URL returned empty content' }, 400);
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        return jsonResponse({ error: 'URL took too long to respond (10s timeout)' }, 408);
      }
      return jsonResponse({ error: 'Failed to fetch URL: ' + (err.message || 'Unknown error') }, 500);
    }

    // Step 8 - Scan for malicious content in raw CSV
    const suspiciousPatterns = [/<script[\s>]/i, /javascript\s*:/i, /<iframe[\s>]/i, /data:text\/html/i];
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(csvText)) {
        return jsonResponse({ error: 'Suspicious content detected in CSV' }, 400);
      }
    }

    // Step 9 - Parse CSV server-side with RFC 4180 compliant parser
    function parseCSV(text) {
      if (!text || text.trim().length === 0) return [];

      // Detect delimiter from first line (scan up to first newline outside quotes)
      let firstLine = '';
      let inQ = false;
      for (let i = 0; i < text.length && i < 10000; i++) {
        if (text[i] === '"') inQ = !inQ;
        if (!inQ && (text[i] === '\n' || text[i] === '\r')) break;
        firstLine += text[i];
      }
      const tabCount = (firstLine.match(/\t/g) || []).length;
      const commaCount = (firstLine.match(/,/g) || []).length;
      const delimiter = tabCount >= commaCount ? '\t' : ',';

      // Parse character by character, respecting quotes
      const rows = [];
      let row = [];
      let cell = '';
      let inQuotes = false;
      let i = 0;

      while (i < text.length) {
        const char = text[i];

        if (inQuotes) {
          if (char === '"') {
            if (i + 1 < text.length && text[i + 1] === '"') {
              cell += '"';
              i += 2;
              continue;
            } else {
              inQuotes = false;
              i++;
              continue;
            }
          } else {
            cell += char;
            i++;
            continue;
          }
        }

        // Not in quotes
        if (char === '"') {
          inQuotes = true;
          i++;
        } else if (char === delimiter) {
          row.push(cell);
          cell = '';
          i++;
        } else if (char === '\r') {
          // Handle \r\n and \r
          row.push(cell);
          cell = '';
          if (row.some(c => c.trim().length > 0)) rows.push(row);
          row = [];
          if (i + 1 < text.length && text[i + 1] === '\n') i++;
          i++;
        } else if (char === '\n') {
          row.push(cell);
          cell = '';
          if (row.some(c => c.trim().length > 0)) rows.push(row);
          row = [];
          i++;
        } else {
          cell += char;
          i++;
        }
      }

      // Last cell/row
      row.push(cell);
      if (row.some(c => c.trim().length > 0)) rows.push(row);

      return rows;
    }

    const parsedData = parseCSV(csvText);

    // Step 10 - Validate parsed data using existing validateInput
    const validation = validateInput(parsedData, tier);
    if (!validation.valid) {
      return jsonResponse({ error: validation.error }, 400);
    }

    // Step 11 - Check malicious content on RAW parsed data FIRST
    for (const row of parsedData) {
      for (const cell of row) {
        if (detectMaliciousContent(String(cell || ''))) {
          return jsonResponse({ error: 'Invalid content detected' }, 400);
        }
      }
    }

    // Step 12 - THEN sanitize all cells
    const sanitizedData = parsedData.map(row => row.map(cell => sanitizeCell(cell)));

    // Step 13 - Normalize rows to uniform length
    const maxCols = Math.max(...sanitizedData.map(row => row.length));
    sanitizedData.forEach(row => {
      while (row.length < maxCols) row.push('');
    });

    // Step 14 - Post-sanitization size check
    const sanitizedJsonSize = JSON.stringify(sanitizedData).length;
    const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;
    if (sanitizedJsonSize > limits.maxSize) {
      return jsonResponse({ error: 'Data too large after processing (max 5MB). Try fewer special characters or smaller dataset.' }, 400);
    }

    // Step 15 - Handle optional password. Uses the SAME PBKDF2 + per-table salt
    // path as create.js. This previously used unsalted SHA-256, which silently
    // downgraded every URL-fetch password to the legacy verify branch.
    let passwordHash = null;
    let passwordSalt = null;
    let passwordKdf = null;
    if (password && password.trim()) {
      const hashed = await hashPassword(password.trim());
      passwordHash = hashed.hash;
      passwordSalt = hashed.salt;
      passwordKdf = hashed.kdf;
    }

    // Step 16 - Handle expiry (same logic as create.js)
    const sanitizedTitle = title ? escapeHtml(title.trim().substring(0, 100)) : null;
    let finalExpiry = 7776000; // Default 90 days for Pro
    if (tier === 'owner') {
      finalExpiry = 315360000;
    } else if (expiry) {
      const requestedExpiry = parseInt(expiry);
      if (requestedExpiry >= 3600 && requestedExpiry <= 7776000) {
        finalExpiry = requestedExpiry;
      }
    }

    // Step 17 - Generate ID and store
    const id = await generateUniqueId(env.TABLES);

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
      // Pro-gated for parity with create.js. This handler is already Pro-only,
      // but keep the gate explicit so a future auth change can't leak the flag.
      noBranding: (tier === 'pro' || tier === 'owner') ? (noBranding || false) : false,
      noHeaders: noHeaders || false,
      tier: tier,
      source: 'url-fetch',
      // Store origin + path ONLY. Signed CSV endpoints routinely carry credentials
      // in the query string (?token=, ?signature=, ?api_key=, ?X-Amz-Signature=),
      // and the full URL was persisted into a table record with up to a 90-day TTL.
      // The rendered page never needed the query string.
      sourceUrl: (function () {
        try {
          const u = new URL(url.trim());
          return (u.origin + u.pathname).substring(0, 500);
        } catch {
          return null;
        }
      })()
    };

    await env.TABLES.put(id, JSON.stringify(tableData), { expirationTtl: finalExpiry });

    // Step 18 - Track analytics.
    // Only 'tables_created' has a lifetime reader (handleStats). The lifetime
    // counters for url_fetched and pro_tables are written by nobody's reader, and
    // since incrementMetric now AWAITS that write, leaving them on would cost
    // 6 sequential KV writes per URL fetch against the 1,000/day free ceiling.
    try {
      await incrementMetric(env.TABLES, 'tables_created');
      await incrementMetric(env.TABLES, 'url_fetched', { bumpLifetime: false });
      await incrementMetric(env.TABLES, 'pro_tables', { bumpLifetime: false });
    } catch (e) {
      // fail silently
    }

    // Step 19 - Return success
    const resultUrl = new URL(request.url).origin + '/t/' + id;
    return jsonResponse({
      id,
      url: resultUrl,
      rows: sanitizedData.length,
      cols: maxCols,
      passwordProtected: !!passwordHash,
      source: 'url-fetch'
    }, 201);

  } catch (error) {
    console.error('Fetch URL handler error:', error.message, error.stack);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}
