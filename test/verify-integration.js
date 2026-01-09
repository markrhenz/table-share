/**
 * Complete Integration Verification
 * 
 * Checks all components of the Ko-fi + SendGrid integration.
 * 
 * Usage:
 *   node test/verify-integration.js
 */

async function verifyIntegration() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║     TABLE SHARE INTEGRATION VERIFICATION                 ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  
  let allPassed = true;
  const results = [];
  
  // Test 1: Check webhook endpoint is accessible
  console.log('1️⃣  Checking webhook endpoint accessibility...');
  try {
    const response = await fetch('https://table-share.org/api/kofi-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    if (response.status === 400 || response.status === 401) {
      // Expected - no valid token provided
      console.log('   ✅ Endpoint is live and responding');
      results.push({ test: 'Webhook Endpoint', status: 'PASS' });
    } else {
      console.log(`   ⚠️  Unexpected status: ${response.status}`);
      results.push({ test: 'Webhook Endpoint', status: 'WARN' });
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    results.push({ test: 'Webhook Endpoint', status: 'FAIL' });
    allPassed = false;
  }
  
  // Test 2: Check pricing page has Ko-fi link
  console.log('\n2️⃣  Checking pricing page Ko-fi integration...');
  try {
    const response = await fetch('https://table-share.org/pricing');
    const html = await response.text();
    
    if (html.includes('ko-fi.com')) {
      console.log('   ✅ Ko-fi link present on pricing page');
      results.push({ test: 'Pricing Ko-fi Link', status: 'PASS' });
    } else {
      console.log('   ❌ Ko-fi link NOT found on pricing page');
      results.push({ test: 'Pricing Ko-fi Link', status: 'FAIL' });
      allPassed = false;
    }
    
    if (html.includes('$5')) {
      console.log('   ✅ $5 pricing displayed correctly');
      results.push({ test: 'Pricing Amount', status: 'PASS' });
    } else {
      console.log('   ⚠️  $5 price not found');
      results.push({ test: 'Pricing Amount', status: 'WARN' });
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    results.push({ test: 'Pricing Page', status: 'FAIL' });
    allPassed = false;
  }
  
  // Test 3: Check homepage Pro Mode UI
  console.log('\n3️⃣  Checking homepage Pro Mode UI...');
  try {
    const response = await fetch('https://table-share.org/');
    const html = await response.text();
    
    if (html.includes('Pro Mode')) {
      console.log('   ✅ Pro Mode toggle present');
      results.push({ test: 'Pro Mode UI', status: 'PASS' });
    } else {
      console.log('   ❌ Pro Mode toggle NOT found');
      results.push({ test: 'Pro Mode UI', status: 'FAIL' });
      allPassed = false;
    }
    
    if (html.includes('ts_live_')) {
      console.log('   ⚠️  API key format exposed in HTML (expected for validation)');
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    results.push({ test: 'Homepage', status: 'FAIL' });
    allPassed = false;
  }
  
  // Test 4: Check SendGrid API accessibility
  console.log('\n4️⃣  Checking SendGrid API accessibility...');
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer invalid_test_key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    
    if (response.status === 401) {
      console.log('   ✅ SendGrid API is reachable (401 expected without valid key)');
      results.push({ test: 'SendGrid API', status: 'PASS' });
    } else {
      console.log(`   ⚠️  Unexpected status: ${response.status}`);
      results.push({ test: 'SendGrid API', status: 'WARN' });
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    results.push({ test: 'SendGrid API', status: 'FAIL' });
    allPassed = false;
  }
  
  // Test 5: DNS check for table-share.org
  console.log('\n5️⃣  Checking DNS configuration...');
  try {
    const response = await fetch('https://dns.google/resolve?name=table-share.org&type=A');
    const data = await response.json();
    
    if (data.Answer && data.Answer.length > 0) {
      console.log(`   ✅ Domain resolves to: ${data.Answer[0].data}`);
      results.push({ test: 'DNS Resolution', status: 'PASS' });
    } else {
      console.log('   ⚠️  No A record found');
      results.push({ test: 'DNS Resolution', status: 'WARN' });
    }
  } catch (error) {
    console.log(`   ⚠️  Could not check DNS: ${error.message}`);
    results.push({ test: 'DNS Resolution', status: 'SKIP' });
  }
  
  // Summary
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                    SUMMARY                               ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  
  results.forEach(r => {
    const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`║  ${icon} ${r.test.padEnd(30)} ${r.status.padEnd(10)}      ║`);
  });
  
  console.log('╚══════════════════════════════════════════════════════════╝');
  
  if (allPassed) {
    console.log('\n🎉 All critical checks passed!');
    console.log('');
    console.log('Next steps to fully verify:');
    console.log('  1. Run: node test/test-sendgrid.js YOUR_EMAIL');
    console.log('  2. Make a real $5 Ko-fi purchase');
    console.log('  3. Verify API key email arrives');
    console.log('  4. Test the API key on table-share.org');
  } else {
    console.log('\n⚠️  Some checks failed. Review the output above.');
  }
  
  console.log('');
}

// Check for Node.js 18+ fetch
if (typeof fetch === 'undefined') {
  console.log('❌ This script requires Node.js 18+ for native fetch');
  process.exit(1);
}

verifyIntegration();
