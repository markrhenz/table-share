// POST /api/recover
// Body: { transactionId, email }
// Looks up a Pro key by matching BOTH transaction ID AND email (defense in depth).
// On match, re-sends the API key via Resend to the registered email address.
// Rate limited to 3 attempts per IP per hour to prevent brute-force scans.
//
// Security properties:
//   - Returns the same generic response whether or not a match was found (no info leak).
//   - Email is only sent to the address ON RECORD, not the one supplied (prevents takeover).
//   - Both transactionId and email must match the stored values exactly.

import { jsonResponse } from '../utils/headers.js';

const MAX_ATTEMPTS_PER_HOUR = 3;
const RATE_WINDOW_SECONDS = 60 * 60;
const SCAN_LIMIT = 1000;

function getClientIp(request) {
  return request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';
}

async function isRateLimited(env, ip) {
  const rateKey = `recover_rate:${ip}`;
  try {
    const raw = await env.TABLES.get(rateKey);
    const count = raw ? parseInt(raw) : 0;
    if (count >= MAX_ATTEMPTS_PER_HOUR) return true;
    await env.TABLES.put(rateKey, String(count + 1), { expirationTtl: RATE_WINDOW_SECONDS });
    return false;
  } catch (err) {
    console.error('Rate limit check failed:', err);
    return false; // fail-open on rate limit; the email gate still protects us
  }
}

// Generic success response — same shape whether a key was found or not.
function genericSuccess() {
  return jsonResponse({
    ok: true,
    message: 'If your transaction ID and email match a Pro purchase, the key has been re-sent to that email address. Check your inbox (and spam folder) in a few minutes.'
  });
}

export async function handleRecoverKey(request, env) {
  // Parse body
  let body;
  try {
    body = await request.json();
  } catch (parseErr) {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const transactionId = body && typeof body.transactionId === 'string' ? body.transactionId.trim() : '';
  const submittedEmail = body && typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

  // Validate input shape WITHOUT confirming existence
  if (!transactionId || transactionId.length < 4 || transactionId.length > 128) {
    return jsonResponse({ error: 'Invalid transaction ID format' }, 400);
  }
  if (!submittedEmail || submittedEmail.length < 5 || submittedEmail.length > 320 ||
      !submittedEmail.includes('@') || !submittedEmail.includes('.')) {
    return jsonResponse({ error: 'Invalid email format' }, 400);
  }

  // Rate limit per IP
  const ip = getClientIp(request);
  if (await isRateLimited(env, ip)) {
    return jsonResponse({
      error: 'Too many attempts. Try again in an hour or email markrhenz@table-share.org.'
    }, 429);
  }

  // Resolve transactionId -> apiKey.
  //
  // Fast path: the tx:{transactionId} index written by the Ko-fi webhook. ONE read.
  // Slow path: the legacy full scan, kept only for purchases made before the index
  // existed. The scan costs ~1 KV read per issued key per call and, at 3 attempts
  // per hour per IP, was a viable way to exhaust the 100,000 reads/day free
  // allowance — which would 404 every table on the site. New purchases never
  // reach it.
  let foundKey = null;
  let foundData = null;
  try {
    const indexed = await env.TABLES.get(`tx:${transactionId}`);
    if (indexed) {
      const raw = await env.TABLES.get(`keys:${indexed}`);
      if (raw) {
        try {
          foundData = JSON.parse(raw);
          foundKey = indexed;
        } catch { /* fall through to legacy scan */ }
      }
    }

    if (!foundKey) {
      const listing = await env.TABLES.list({ prefix: 'keys:', limit: SCAN_LIMIT });
      for (const k of listing.keys) {
        const raw = await env.TABLES.get(k.name);
        if (!raw) continue;
        let parsed;
        try { parsed = JSON.parse(raw); } catch { continue; }
        if (parsed.transactionId === transactionId) {
          foundKey = k.name.replace('keys:', '');
          foundData = parsed;
          // Backfill the index so this purchase never triggers a scan again.
          try { await env.TABLES.put(`tx:${transactionId}`, foundKey); } catch { /* non-fatal */ }
          break;
        }
      }
    }
  } catch (err) {
    console.error('Recovery scan failed:', err);
    return jsonResponse({ error: 'Internal error. Try again later.' }, 500);
  }

  // No match — return generic success anyway (no info leak).
  if (!foundKey || !foundData) {
    return genericSuccess();
  }

  // Both must match. Compare email case-insensitively against stored value.
  const storedEmail = (foundData.email || '').trim().toLowerCase();
  if (!storedEmail || storedEmail !== submittedEmail) {
    return genericSuccess();
  }

  // Don't recover revoked keys.
  if (foundData.revoked === true) {
    return jsonResponse({
      ok: true,
      message: 'This key has been revoked. Email markrhenz@table-share.org for assistance.'
    });
  }

  // Re-send the key to the email ON RECORD (not the submitted one — they happen to match here,
  // but using storedEmail makes the security intent explicit).
  try {
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Table Share <no-reply@notifications.table-share.org>',
        reply_to: 'markrhenz@table-share.org',
        to: [storedEmail],
        subject: 'Your Table Share Pro API Key (recovery)',
        text: `Hi,

You (or someone) requested a Pro API key recovery for this email address.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR API KEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${foundKey}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOW TO USE IT:

1. Go to https://table-share.org
2. Click "🔑 Pro Mode (Optional)"
3. Paste your key
4. Done! It saves automatically.

If you did NOT request this, you can ignore the email — your key is unchanged
and only the email address on record received this message.

For any issues, reply to this email.

- Mark
Table Share
https://table-share.org`
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error(`❌ Recovery email failed for ${storedEmail}: ${errorText.substring(0, 200)}`);
      // Still return generic success — don't leak that the lookup matched.
    } else {
      console.log(`✅ Recovery email sent for transaction ${transactionId}`);
    }
  } catch (mailErr) {
    console.error('Recovery email exception:', mailErr);
    // Still return generic success.
  }

  return genericSuccess();
}
