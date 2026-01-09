/**
 * Resend Email Test
 * 
 * Tests Resend API key and email delivery independently of Ko-fi.
 * 
 * Usage:
 *   Set SENDGRID_API_KEY environment variable (name kept for compatibility), then:
 *   node test/test-sendgrid.js your-email@example.com
 */

const TEST_API_KEY = 'ts_live_TEST123456789012345678';

async function testResend(recipientEmail) {
  console.log('\n=== Resend Email Test ===\n');
  
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.log('❌ SENDGRID_API_KEY environment variable not set');
    console.log('');
    console.log('Set it with:');
    console.log('  PowerShell: $env:SENDGRID_API_KEY = "re_xxxxx"');
    console.log('  CMD: set SENDGRID_API_KEY=re_xxxxx');
    console.log('  Bash: export SENDGRID_API_KEY="re_xxxxx"');
    return;
  }
  
  if (!recipientEmail) {
    console.log('❌ No recipient email provided');
    console.log('   Usage: node test/test-sendgrid.js your-email@example.com');
    return;
  }
  
  console.log(`📧 Sending test email to: ${recipientEmail}`);
  console.log(`🔑 Using API key: ${apiKey.substring(0, 12)}...`);
  console.log('');
  
  const emailPayload = {
    from: 'Table Share <no-reply@notifications.table-share.org>',
    to: [recipientEmail],
    subject: 'Table Share - Email Test 🧪',
    text: `This is a test email from Table Share.

If you're seeing this, Resend integration is working! ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TEST API KEY (not real)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${TEST_API_KEY}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is just a test. Real API keys are delivered when you purchase Pro.

- Table Share
https://table-share.org`
  };
  
  try {
    console.log('📤 Sending email via Resend API...\n');
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailPayload)
    });
    
    const responseBody = await response.json();
    
    console.log(`📥 Response Status: ${response.status}`);
    
    if (response.status === 200) {
      console.log('✅ SUCCESS! Email sent via Resend.');
      console.log(`   Message ID: ${responseBody.id}`);
      console.log('');
      console.log('📧 Check your inbox (and spam folder) for:');
      console.log('   Subject: "Table Share - Email Test 🧪"');
      console.log('   From: no-reply@notifications.table-share.org');
    } else if (response.status === 401) {
      console.log('❌ FAILED: Invalid API key');
      console.log('   Check your SENDGRID_API_KEY value');
    } else if (response.status === 403) {
      console.log('❌ FAILED: Forbidden');
      console.log('   Error:', JSON.stringify(responseBody, null, 2));
      console.log('');
      console.log('Common causes:');
      console.log('   1. Domain not verified in Resend (table-share.org)');
      console.log('   2. Sending from unverified email address');
    } else if (response.status === 422) {
      console.log('❌ FAILED: Validation error');
      console.log('   Error:', JSON.stringify(responseBody, null, 2));
    } else {
      console.log('❌ FAILED: Unexpected error');
      console.log('   Response:', JSON.stringify(responseBody, null, 2));
    }
    
  } catch (error) {
    console.log('❌ ERROR:', error.message);
  }
}

// Check for Node.js 18+ fetch
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ for native fetch');
  process.exit(1);
}

const recipientEmail = process.argv[2];
testResend(recipientEmail);
