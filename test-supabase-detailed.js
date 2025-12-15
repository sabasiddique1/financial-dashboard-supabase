// Detailed Supabase API test with multiple approaches
const https = require('https');
const dns = require('dns').promises;
const fs = require('fs');

console.log('🔍 Detailed Supabase API Diagnostic\n');
console.log('='.repeat(70));

// Read config
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  });
} catch (err) {
  console.log('❌ Could not read .env.local');
  process.exit(1);
}

const urlObj = new URL(supabaseUrl);
const projectId = urlObj.hostname.split('.')[0];

console.log(`📋 Project Details:`);
console.log(`   Project ID: ${projectId}`);
console.log(`   Full URL: ${supabaseUrl}`);
console.log(`   API Key: ${supabaseKey.substring(0, 40)}...\n`);

// Test DNS with multiple record types
async function testDNSComprehensive() {
  console.log('🌐 Comprehensive DNS Tests');
  console.log('-'.repeat(70));
  
  const domain = urlObj.hostname;
  
  // Test A record
  try {
    const aRecords = await dns.resolve4(domain);
    console.log(`✅ A record found: ${aRecords.join(', ')}\n`);
    return true;
  } catch (err) {
    console.log(`❌ A record lookup failed: ${err.code}`);
  }
  
  // Test AAAA record (IPv6)
  try {
    const aaaaRecords = await dns.resolve6(domain);
    console.log(`✅ AAAA record found: ${aaaaRecords.join(', ')}\n`);
    return true;
  } catch (err) {
    console.log(`❌ AAAA record lookup failed: ${err.code}`);
  }
  
  // Test CNAME
  try {
    const cnameRecords = await dns.resolveCname(domain);
    console.log(`✅ CNAME found: ${cnameRecords.join(', ')}\n`);
    return true;
  } catch (err) {
    console.log(`ℹ️  No CNAME record (this is normal)\n`);
  }
  
  // Try to resolve via different DNS servers
  console.log('🔍 Trying alternative DNS resolution...');
  try {
    // Try Google DNS
    const resolver = require('dns').Resolver();
    resolver.setServers(['8.8.8.8', '8.8.4.4']);
    const addresses = await new Promise((resolve, reject) => {
      resolver.resolve4(domain, (err, addresses) => {
        if (err) reject(err);
        else resolve(addresses);
      });
    });
    console.log(`✅ Resolved via Google DNS: ${addresses.join(', ')}\n`);
    return true;
  } catch (err) {
    console.log(`❌ Alternative DNS also failed: ${err.code}\n`);
  }
  
  return false;
}

// Test if Supabase API is accessible via IP (if we can get it)
async function testDirectIP() {
  console.log('🔗 Testing Direct IP Connection');
  console.log('-'.repeat(70));
  
  // Supabase uses Cloudflare, so we can't directly test IP
  // But we can check if it's a Cloudflare issue
  console.log('ℹ️  Supabase uses Cloudflare CDN, so direct IP testing is not possible.');
  console.log('   The domain must resolve for the API to work.\n');
}

// Test project status via Supabase status API (if available)
function testStatusAPI() {
  return new Promise((resolve) => {
    console.log('📊 Testing Project Status');
    console.log('-'.repeat(70));
    
    // Try to check project status
    // Note: This might not work if project is paused, but worth trying
    const statusUrl = `https://api.supabase.com/v1/projects/${projectId}`;
    
    console.log(`   Attempting: ${statusUrl}`);
    console.log(`   Note: This requires authentication and may not be publicly accessible.\n`);
    
    // We can't test this without proper API keys, so skip
    console.log('ℹ️  Status API requires authenticated access.\n');
    resolve({ success: false, skipped: true });
  });
}

// Main test function
async function runTests() {
  const dnsOk = await testDNSComprehensive();
  
  if (!dnsOk) {
    console.log('='.repeat(70));
    console.log('📊 DIAGNOSIS');
    console.log('='.repeat(70));
    console.log('\n❌ CONFIRMED: Supabase project domain does not exist in DNS.');
    console.log('\n💡 ROOT CAUSE:');
    console.log('   The domain "gifsrkjqzthenueihs.supabase.co" cannot be resolved.');
    console.log('   This happens when:');
    console.log('   1. ❌ Project is PAUSED (most common - free tier auto-pauses after 7 days)');
    console.log('   2. ❌ Project was DELETED');
    console.log('   3. ❌ Project reference ID is INCORRECT');
    
    console.log('\n🔧 SOLUTION:');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log('   2. Look for project ID: gifsrkjqzthenueihs');
    console.log('   3. If paused: Click "Resume" or "Restore"');
    console.log('   4. Wait 1-2 minutes for DNS to update');
    console.log('   5. Run this test again to verify');
    
    console.log('\n📝 If project doesn\'t exist:');
    console.log('   1. Create a new Supabase project');
    console.log('   2. Go to Settings → API');
    console.log('   3. Copy the Project URL');
    console.log('   4. Update .env.local with new URL and key');
    console.log('   5. Restart your dev server\n');
    
    await testDirectIP();
    return;
  }
  
  await testDirectIP();
  await testStatusAPI();
  
  console.log('='.repeat(70));
  console.log('✅ DNS resolution successful! Project appears to be active.');
  console.log('   You can now test the API endpoints.\n');
}

runTests().catch(console.error);



