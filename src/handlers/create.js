import { generateUniqueId } from '../utils/id-generator.js';
import { validateInput, sanitizeCell, detectMaliciousContent } from '../utils/sanitizer.js';
import { checkRateLimit } from '../utils/rate-limiter.js';

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
    const { data, honeypot } = await request.json();

    // 4. Honeypot check
    if (honeypot) {
      return new Response(JSON.stringify({ error: 'Invalid submission' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. Validate input
    const validation = validateInput(data);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 6. Sanitize all cells
    const sanitizedData = data.map(row => row.map(cell => sanitizeCell(cell)));

    // 7. Normalize rows to uniform length
    const maxCols = Math.max(...sanitizedData.map(row => row.length));
    sanitizedData.forEach(row => {
      while (row.length < maxCols) row.push("");
    });

    // 8. Check malicious content in all cells
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

    // 8. Generate ID
    const id = await generateUniqueId(env.TABLES);

    // 9. Store in KV
    const tableData = {
       data: sanitizedData,
       createdAt: new Date().toISOString(),
       rowCount: sanitizedData.length,
       colCount: maxCols
     };
    await env.TABLES.put(id, JSON.stringify(tableData), { expirationTtl: 2592000 });

    // 10. Return success
    const url = `${new URL(request.url).origin}/t/${id}`;
    return new Response(JSON.stringify({ id, url }), {
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