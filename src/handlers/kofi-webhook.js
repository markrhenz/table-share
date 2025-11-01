// Removed unused import

export async function handleKofiWebhook(request, env) {
  try {
    const formData = await request.formData();
    const data = JSON.parse(formData.get('data'));
    
    // DEBUG: Log what Ko-fi sends
    console.log('Ko-fi webhook received:', JSON.stringify(data, null, 2));
    
    // Verify webhook (get token from Ko-fi dashboard)
    const KOFI_VERIFICATION_TOKEN = env.KOFI_TOKEN; // Store in wrangler.toml
    if (data.verification_token !== KOFI_VERIFICATION_TOKEN) {
      return new Response('Unauthorized', { status: 401 });
    }
    
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
        transactionId: data.message_id
      };
      
      await env.TABLES.put(`keys:${apiKey}`, JSON.stringify(keyData));
      
      // Send email with API key via SendGrid
      try {
        const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,  // Added space after Bearer
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: data.email }],
              subject: 'Your Table Share Pro API Key 🎉'
            }],
            from: {
              email: 'markrhenz2@gmail.com',
              name: 'Table Share'
            },
            reply_to: {
              email: 'markrhenz2@gmail.com',
              name: 'Mark - Table Share'
            },
            content: [{
              type: 'text/plain',
              value: `Hi there!

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
✓ 100 columns (same as free)
✓ 90-day link expiration (vs 30 days)
✓ Valid for 1 year from today

NEED HELP?

Just reply to this email - I respond within 24 hours.

Thanks for supporting Table Share!

- Mark
Table Share
https://table-share.org`
            }]
          })
        });
        
        if (emailResponse.ok) {
          console.log(`✅ API key successfully emailed to ${data.email}`);
        } else {
          const errorText = await emailResponse.text();
          console.error(`❌ SendGrid error: ${errorText}`);
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
Transaction: ${data.message_id}
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