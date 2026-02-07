import { jsonResponse } from '../utils/headers.js';
import { validateApiKey } from '../utils/api-key.js';
import { validateURL } from '../utils/url-validator.js';
import { checkRateLimit } from '../utils/rate-limiter.js';
import { validateInput, sanitizeCell, detectMaliciousContent, escapeHtml } from '../utils/sanitizer.js';
import { generateUniqueId } from '../utils/id-generator.js';
import { incrementMetric } from '../utils/analytics.js';

export async function handleFetchURL(request, env) {
  try {
    // Step 1 - Extract IP
    const ip = request.headers.get('CF-Connecting-IP') || '127.0.0.1';

    // Step 2 - Parse request body with try/catch
    let url, apiKey, title, password, expiry, noBranding;
    try {
      ({ url, apiKey, title, password, expiry, noBranding } = await request.json());
    } catch (parseError) {
      return jsonResponse({ error: 'Invalid request body' }, 400);
    }

    // Step 3 - Validate API key (PRO GATE)
    const { valid: isProUser, tier } = await validateApiKey(apiKey, env.TABLES);
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

    // Step 9 - Parse CSV server-side. Since we don't have PapaParse on the backend, do a simple split
    function parseCSV(text) {
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length === 0) return [];

      // Detect delimiter from first line
      const firstLine = lines[0];
      const tabCount = (firstLine.match(/\t/g) || []).length;
      const commaCount = (firstLine.match(/,/g) || []).length;
      const delimiter = tabCount >= commaCount ? '\t' : ',';

      return lines.map(line => {
        const cells = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (inQuotes) {
            if (char === '"') {
              if (i + 1 < line.length && line[i + 1] === '"') {
                current += '"';
                i++;
              } else {
                inQuotes = false;
              }
            } else {
              current += char;
            }
          } else {
            if (char === '"') {
              inQuotes = true;
            } else if (char === delimiter) {
              cells.push(current);
              current = '';
            } else {
              current += char;
            }
          }
        }
        cells.push(current);
        return cells;
      });
    }

    const parsedData = parseCSV(csvText);

    // Step 10 - Validate parsed data using existing validateInput
    const validation = validateInput(parsedData, tier);
    if (!validation.valid) {
      return jsonResponse({ error: validation.error }, 400);
    }

    // Step 11 - Sanitize all cells
    const sanitizedData = parsedData.map(row => row.map(cell => sanitizeCell(cell)));

    // Step 12 - Normalize rows to uniform length
    const maxCols = Math.max(...sanitizedData.map(row => row.length));
    sanitizedData.forEach(row => {
      while (row.length < maxCols) row.push('');
    });

    // Step 13 - Check malicious content per cell
    for (const row of sanitizedData) {
      for (const cell of row) {
        if (detectMaliciousContent(cell)) {
          return jsonResponse({ error: 'Invalid content detected' }, 400);
        }
      }
    }

    // Step 14 - Handle optional password (same logic as create.js)
    let passwordHash = null;
    if (password && password.trim()) {
      const encoder = new TextEncoder();
      const pwData = encoder.encode(password.trim());
      const hashBuffer = await crypto.subtle.digest('SHA-256', pwData);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Step 15 - Handle expiry (same logic as create.js)
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

    // Step 16 - Generate ID and store
    const id = await generateUniqueId(env.TABLES);

    const tableData = {
      data: sanitizedData,
      title: sanitizedTitle,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + finalExpiry * 1000).toISOString(),
      rowCount: sanitizedData.length,
      colCount: maxCols,
      passwordHash: passwordHash,
      noBranding: noBranding || false,
      tier: tier,
      source: 'url-fetch',
      sourceUrl: url.trim().substring(0, 500)
    };

    await env.TABLES.put(id, JSON.stringify(tableData), { expirationTtl: finalExpiry });

    // Step 17 - Track analytics
    try {
      await incrementMetric(env.TABLES, 'tables_created');
      await incrementMetric(env.TABLES, 'url_fetched');
      await incrementMetric(env.TABLES, 'pro_tables');
    } catch (e) {
      // fail silently
    }

    // Step 18 - Return success
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
