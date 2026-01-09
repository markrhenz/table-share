/**
 * Ko-fi Webhook Integration Test
 * 
 * This script tests the Ko-fi webhook endpoint locally and in production.
 * 
 * Usage:
 *   node test/test-kofi-webhook.js local    # Test local dev server
 *   node test/test-kofi-webhook.js prod     # Test production (BE CAREFUL - creates real key)
 *   node test/test-kofi-webhook.js dry      # Dry run - just show payload
 */

const TEST_EMAIL = 'test@example.com'; // Change to your email for real test

// Simulated Ko-fi webhook payload
function createKofiPayload(verificationToken) {
  return {
    verification_token: verificationToken,
    message_id: 'test_' + Date.now(),
    timestamp: new Date().toISOString(),
    type: 'Donation', // or 'Shop Order'
    is_public: true,
    from_name: 'Test User',
    message: 'Test purchase for Table Share Pro',
    amount: '5.00',
    url: 'https://ko-fi.com/test',
    email: TEST_EMAIL,
    currency: 'USD',
    is_subscription_payment: false,
    is_first_subscription_payment: false,
    kofi_transaction_id: 'test_txn_' + Date.now(),
    shop_items: null,
    tier_name: null
  };
}

async function testWebhook(mode) {
  console.log('\n=== Ko-fi Webhook Test ===\n');
  
  // Get the verification token
  const verificationToken = process.env.KOFI_TOKEN || 'YOUR_KOFI_TOKEN_HERE';
  
  if (verificationToken === 'YOUR_KOFI_TOKEN_HERE') {
    console.log('⚠️  Set KOFI_TOKEN environment variable or edit this script');
    console.log('   Get it from: https://ko-fi.com/manage/webhooks\n');
  }
  
  const payload = createKofiPayload(verificationToken);
  
  // Determine endpoint
  let endpoint;
  switch (mode) {
    case 'local':
      endpoint = 'http://localhost:8787/api/kofi-webhook';
      break;
    case 'prod':
      endpoint = 'https://table-share.org/api/kofi-webhook';
      console.log('⚠️  WARNING: This will create a REAL Pro API key!\n');
      break;
    case 'dry':
    default:
      console.log('📋 Dry Run - Payload that would be sent:\n');
      console.log(JSON.stringify(payload, null, 2));
      console.log('\n📋 As form data (Ko-fi format):');
      console.log(`   data=${encodeURIComponent(JSON.stringify(payload))}`);
      return;
  }
  
  console.log(`🎯 Target: ${endpoint}`);
  console.log(`📧 Email: ${TEST_EMAIL}`);
  console.log(`💰 Amount: $${payload.amount}`);
  console.log(`🔑 Token: ${verificationToken.substring(0, 8)}...`);
  console.log('');
  
  try {
    // Ko-fi sends form-data, not JSON
    const formData = new URLSearchParams();
    formData.append('data', JSON.stringify(payload));
    
    console.log('📤 Sending webhook request...\n');
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });
    
    const responseText = await response.text();
    
    console.log(`📥 Response Status: ${response.status}`);
    console.log(`📥 Response Body: ${responseText}`);
    console.log('');
    
    if (response.status === 200) {
      console.log('✅ SUCCESS! Webhook processed correctly.');
      console.log('');
      console.log('📧 Check these places for the API key:');
      console.log(`   1. Email inbox: ${TEST_EMAIL}`);
      console.log('   2. Cloudflare Workers logs (wrangler tail)');
      console.log('   3. KV storage: keys:ts_live_*');
    } else if (response.status === 401) {
      console.log('❌ FAILED: Invalid verification token');
      console.log('   Check your KOFI_TOKEN secret in Cloudflare');
    } else if (response.status === 400) {
      console.log('❌ FAILED: Bad request or invalid payment');
      console.log('   Check the payload format');
    } else {
      console.log('❌ FAILED: Unexpected error');
    }
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Tip: Start local dev server with: wrangler dev');
    }
  }
}

// Check for Node.js 18+ fetch
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ for native fetch');
  console.log('   Or run: npm install node-fetch');
  process.exit(1);
}

const mode = process.argv[2] || 'dry';
testWebhook(mode);
