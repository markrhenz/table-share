// Ko-fi Webhook Handler with Deduplication

import { textResponse } from '../utils/headers.js';

export async function handleKofiWebhook(request, env) {
  try {
    console.log('=== Ko-fi Webhook Request Received ===');
    console.log('Method:', request.method);
    console.log('Content-Type:', request.headers.get('content-type'));

    let data;
    const contentType = request.headers.get('content-type')?.toLowerCase();

    try {
      if (contentType?.includes('application/json')) {
        // Handle JSON requests (some API clients send this instead of form data)
        console.log('📝 Processing as JSON request');
        const requestBody = await request.json();
        data = requestBody;
      } else {
        // Handle form data requests (standard Ko-fi format)
        console.log('📄 Processing as form data request');
        const formData = await request.formData();
        console.log('Form data fields:', Array.from(formData.keys()));

        const dataField = formData.get('data');

        if (!dataField) {
          console.error('❌ Missing required "data" field in form data request');
          return textResponse('Missing data field', 400);
        }

        try {
          data = JSON.parse(dataField);
        } catch (parseError) {
          console.error('Failed to parse JSON from form data:', parseError.message);
          return textResponse('Invalid JSON data in form field', 400);
        }
      }
    } catch (bodyError) {
      console.error('❌ Failed to parse request body:', bodyError.message);
      return textResponse('Invalid request body', 400);
    }

    // DEBUG: Log what Ko-fi sends
    console.log('Ko-fi webhook parsed: type=' + (data && data.type));

    // Verify webhook (get token from Ko-fi dashboard)
    const KOFI_VERIFICATION_TOKEN = env.KOFI_TOKEN;
    if (data.verification_token !== KOFI_VERIFICATION_TOKEN) {
      console.error('❌ Invalid verification token');
      return textResponse('Unauthorized', 401);
    }

    // DEDUPLICATION: Check if this transaction was already processed
    const transactionId = data.message_id;
    if (!transactionId) {
      console.error('❌ Missing transaction ID (message_id)');
      return textResponse('Missing transaction ID', 400);
    }

    const dedupKey = `webhook:${transactionId}`;
    const existingRaw = await env.TABLES.get(dedupKey);

    // Idempotency: only a COMPLETED transaction may be rejected as a duplicate.
    // Previously this record was written BEFORE the key was generated and stored,
    // so any downstream failure made the Ko-fi retry return 'Already processed'
    // and the paying customer never received a key. Fulfilment is now defined as
    // "key written to KV", and the record is only stamped completed after that.
    // A retry that finds an incomplete (or legacy) record RESUMES.
    if (existingRaw) {
      let existing = null;
      try { existing = JSON.parse(existingRaw); } catch { existing = null; }
      if (existing && existing.status === 'completed') {
        console.log(`Duplicate webhook, already completed: ${transactionId}`);
        // Return 200 to prevent Ko-fi from retrying
        return textResponse('Already processed', 200);
      }
      console.log(`Resuming incomplete transaction: ${transactionId}`);
    }

    // Check if payment is for Pro key (either donation or shop order)
    const isProPurchase =
      (data.type === 'Donation' && Number.parseFloat(data.amount) >= 5) ||
      (data.type === 'Shop Order' && data.shop_items && data.shop_items.length > 0);

    if (isProPurchase) {
      // Validate email BEFORE generating key. Resend will reject a missing/malformed
      // address and the catch block will swallow it — leaving the key orphaned.
      const email = (data.email || '').trim();
      const emailValid = email.length > 0 && email.length < 320 && email.includes('@') && email.includes('.');

      // Generate Pro API key
      const apiKey = 'ts_live_' + crypto.randomUUID().replaceAll('-', '').substring(0, 24);

      // Store key in KV
      const keyData = {
        tier: 'pro',
        email: emailValid ? email : null,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(), // 100 years
        transactionId: transactionId
      };

      await env.TABLES.put(`keys:${apiKey}`, JSON.stringify(keyData));

      // transactionId -> apiKey index. Lets /api/recover resolve in ONE read instead
      // of listing and reading every keys:* record (which was ~1 KV read per issued
      // key per recovery attempt, against a 100,000 reads/day free ceiling).
      await env.TABLES.put(`tx:${transactionId}`, apiKey);

      // Fulfilment is complete: the key exists and is recoverable. Stamp the dedup
      // record NOW, after storage and before email. Email failure has its own
      // pending_email recovery record and must not cause a second key to be issued.
      await env.TABLES.put(dedupKey, JSON.stringify({
        status: 'completed',
        completedAt: new Date().toISOString()
      }), { expirationTtl: 30 * 24 * 60 * 60 });

      // If email is invalid, record for manual recovery and skip Resend call entirely.
      if (!emailValid) {
        await env.TABLES.put(`pending_email:${transactionId}`, JSON.stringify({
          apiKey,
          email: data.email || '(missing)',
          reason: 'invalid_or_missing_email',
          createdAt: new Date().toISOString()
        }));
        console.error('Invalid/missing email on Ko-fi payload. Key generated but NOT emailed.');
        console.log(`MANUAL ACTION required for transaction ${transactionId}: see /api/admin/pending-emails`);
        return textResponse('OK', 200);
      }

      // Send email with API key via Resend
      let emailSucceeded = false;
      let emailErrorReason = null;
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,  // Actually Resend API key (legacy name)
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Table Share <no-reply@notifications.table-share.org>',
            reply_to: 'markrhenz@table-share.org',
            to: [email],
            subject: 'Your Table Share Pro API Key 🎉',
            text: `Hi there!

Thanks for upgrading to Table Share Pro! 🎉

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR API KEY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${apiKey}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOW TO USE IT:

1. Go to https://table-share.org
2. Click "🔑 Pro Mode (Optional)"
3. Paste your key
4. Done! It saves automatically.

YOUR PRO BENEFITS:

✓ 5,000 rows (10x free tier)
✓ 100 columns (2x free tier)
✓ 90-day link expiration (vs 7 days free)
✓ Password protection for sensitive data
✓ Remove Table Share branding
✓ API key valid for 100 years (pay once, use forever!)

NEED HELP?

Just reply to this email - I respond within 24 hours.

Thanks for supporting Table Share!

- Mark
Table Share
https://table-share.org`
          })
        });

        if (emailResponse.ok) {
          console.log(`Pro key emailed for transaction ${transactionId}`);
          emailSucceeded = true;
        } else {
          const errorText = await emailResponse.text();
          emailErrorReason = `resend_${emailResponse.status}: ${errorText.substring(0, 200)}`;
          console.error(`Resend error: ${errorText}`);
          console.log(`MANUAL ACTION: delivery failed for transaction ${transactionId}, see /api/admin/pending-emails`);
        }
      } catch (emailError) {
        emailErrorReason = `exception: ${(emailError && emailError.message || 'unknown').substring(0, 200)}`;
        console.error('Email delivery failed:', emailError && emailError.message);
        console.log(`MANUAL ACTION: delivery failed for transaction ${transactionId}, see /api/admin/pending-emails`);
      }

      // Persistent recovery record — KV survives log rollover.
      // Write a pending_email record if email failed; remove it if it succeeded
      // (in case a prior failed attempt left a stale record).
      try {
        if (emailSucceeded) {
          await env.TABLES.delete(`pending_email:${transactionId}`);
        } else {
          await env.TABLES.put(`pending_email:${transactionId}`, JSON.stringify({
            apiKey,
            email,
            reason: emailErrorReason || 'unknown',
            createdAt: new Date().toISOString()
          }));
        }
      } catch (kvErr) {
        console.error('Failed to update pending_email record:', kvErr);
      }

      // Structured audit line. NEVER log the ts_live_ value or the purchaser email:
      // Workers logs are readable by anyone with Cloudflare dashboard access, so this
      // block was handing out working Pro credentials plus PII. The key lives in KV;
      // recovery is by transactionId via /recover or /api/admin/pending-emails.
      console.log(`event=pro_purchase transaction=${transactionId} delivery=${emailSucceeded ? 'success' : 'failed'}`);

      return textResponse('OK', 200);
    }

    return textResponse('Invalid payment amount', 400);

  } catch (error) {
    console.error('Ko-fi webhook error:', error);
    return textResponse('Error', 500);
  }
}
