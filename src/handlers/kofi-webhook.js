// Ko-fi Webhook Handler with Deduplication

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
        console.log('Raw data field:', dataField);
        
        if (!dataField) {
          console.error('❌ Missing required "data" field in form data request');
          return new Response('Missing data field', { status: 400 });
        }
        
        try {
          data = JSON.parse(dataField);
        } catch (parseError) {
          console.error('❌ Failed to parse JSON from form data:', parseError.message);
          console.error('Raw data that failed to parse:', dataField);
          return new Response('Invalid JSON data in form field', { status: 400 });
        }
      }
    } catch (bodyError) {
      console.error('❌ Failed to parse request body:', bodyError.message);
      return new Response('Invalid request body', { status: 400 });
    }
    
    // DEBUG: Log what Ko-fi sends
    console.log('✅ Parsed Ko-fi webhook data:', JSON.stringify(data, null, 2));
    
    // Verify webhook (get token from Ko-fi dashboard)
    const KOFI_VERIFICATION_TOKEN = env.KOFI_TOKEN;
    if (data.verification_token !== KOFI_VERIFICATION_TOKEN) {
      console.error('❌ Invalid verification token');
      return new Response('Unauthorized', { status: 401 });
    }
    
    // DEDUPLICATION: Check if this transaction was already processed
    const transactionId = data.message_id;
    if (!transactionId) {
      console.error('❌ Missing transaction ID (message_id)');
      return new Response('Missing transaction ID', { status: 400 });
    }
    
    const dedupKey = `webhook:${transactionId}`;
    const existingTransaction = await env.TABLES.get(dedupKey);
    
    if (existingTransaction) {
      console.log(`⚠️ Duplicate webhook detected for transaction: ${transactionId}`);
      console.log('Already processed at:', existingTransaction);
      // Return 200 to prevent Ko-fi from retrying
      return new Response('Already processed', { status: 200 });
    }
    
    // Mark transaction as being processed (with 30-day TTL)
    await env.TABLES.put(dedupKey, new Date().toISOString(), {
      expirationTtl: 30 * 24 * 60 * 60 // 30 days
    });
    
    // Check if payment is for Pro key (either donation or shop order)
    const isProPurchase =
      (data.type === 'Donation' && Number.parseFloat(data.amount) >= 5) ||
      (data.type === 'Shop Order' && data.shop_items && data.shop_items.length > 0);
    
    if (isProPurchase) {
      // Generate Pro API key
      const apiKey = 'ts_live_' + crypto.randomUUID().replaceAll('-', '').substring(0, 24);
      
      // Store key in KV
      const keyData = {
        tier: 'pro',
        email: data.email,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        transactionId: transactionId
      };
      
      await env.TABLES.put(`keys:${apiKey}`, JSON.stringify(keyData));
      
      // Send email with API key via Resend
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Table Share <no-reply@notifications.table-share.org>',
            to: [data.email],
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
✓ API key valid for 1 year

NEED HELP?

Just reply to this email - I respond within 24 hours.

Thanks for supporting Table Share!

- Mark
Table Share
https://table-share.org`
          })
        });
        
        if (emailResponse.ok) {
          console.log(`✅ API key successfully emailed to ${data.email}`);
        } else {
          const errorText = await emailResponse.text();
          console.error(`❌ Resend error: ${errorText}`);
          console.log(`⚠️ MANUAL ACTION: Email this key to ${data.email}: ${apiKey}`);
        }
      } catch (emailError) {
        console.error('❌ Email delivery failed:', emailError);
        console.log(`⚠️ MANUAL ACTION: Email this key to ${data.email}: ${apiKey}`);
      }
      
      // Always log for backup
      console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NEW PRO USER
Email: ${data.email}
API Key: ${apiKey}
Transaction: ${transactionId}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
      
      return new Response('OK', { status: 200 });
    }
    
    return new Response('Invalid payment amount', { status: 400 });
    
  } catch (error) {
    console.error('Ko-fi webhook error:', error);
    return new Response('Error', { status: 500 });
  }
}
