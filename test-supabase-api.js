// Test Supabase API with direct HTTP requests
const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const dns = require('dns').promises;

console.log('🔍 Testing Supabase API Connection\n');
console.log('='.repeat(70));

// Read environment variables
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  });
  
  console.log('📋 Configuration:');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseKey ? supabaseKey.substring(0, 30) + '...' : 'NOT SET'}\n`);
} catch (err) {
  console.log('❌ Could not read .env.local file');
  process.exit(1);
}

const urlObj = new URL(supabaseUrl);
const domain = urlObj.hostname;

// Test 1: DNS Resolution
async function testDNS() {
  console.log('🌐 Test 1: DNS Resolution');
  console.log('-'.repeat(70));
  
  try {
    const addresses = await dns.resolve4(domain);
    console.log(`✅ DNS resolved successfully`);
    console.log(`   IP addresses: ${addresses.join(', ')}\n`);
    return true;
  } catch (err) {
    console.log(`❌ DNS resolution FAILED`);
    console.log(`   Error: ${err.code} - ${err.message}`);
    console.log(`   Domain: ${domain}\n`);
    
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') {
      console.log('💡 This means the Supabase project domain does not exist.');
      console.log('   The project is likely PAUSED or DELETED.\n');
    }
    return false;
  }
}

// Test 2: HTTPS Connection to Base URL
function testBaseConnection() {
  return new Promise((resolve) => {
    console.log('🔗 Test 2: HTTPS Connection to Base URL');
    console.log('-'.repeat(70));
    
    const req = https.get(supabaseUrl, {
      timeout: 10000,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Connection successful`);
        console.log(`   Status Code: ${res.statusCode}`);
        console.log(`   Status Message: ${res.statusMessage}`);
        console.log(`   Headers:`, JSON.stringify(res.headers, null, 2).substring(0, 300));
        console.log(`   Response: ${data.substring(0, 200)}...\n`);
        resolve({ success: true, statusCode: res.statusCode });
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Connection FAILED`);
      console.log(`   Error Code: ${err.code}`);
      console.log(`   Error Message: ${err.message}\n`);
      
      if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
        console.log('💡 DNS resolution failed. Project is likely paused.\n');
      } else if (err.code === 'ECONNREFUSED') {
        console.log('💡 Connection refused. Check if project is active.\n');
      } else if (err.code === 'ETIMEDOUT') {
        console.log('💡 Connection timeout. Network issue or project inactive.\n');
      }
      
      resolve({ success: false, error: err });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`❌ Connection TIMEOUT`);
      console.log(`   Request took longer than 10 seconds\n`);
      resolve({ success: false, error: new Error('Timeout') });
    });
  });
}

// Test 3: Auth Health Endpoint
function testAuthHealth() {
  return new Promise((resolve) => {
    console.log('🔐 Test 3: Auth Health Endpoint');
    console.log('-'.repeat(70));
    
    const authUrl = `${supabaseUrl}/auth/v1/health`;
    const url = new URL(authUrl);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'GET',
      timeout: 10000,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ Auth endpoint accessible`);
        console.log(`   Status Code: ${res.statusCode}`);
        console.log(`   Response: ${data}\n`);
        resolve({ success: true, statusCode: res.statusCode, data });
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Auth endpoint FAILED`);
      console.log(`   Error: ${err.code} - ${err.message}`);
      console.log(`   URL: ${authUrl}\n`);
      resolve({ success: false, error: err });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`❌ Auth endpoint TIMEOUT\n`);
      resolve({ success: false, error: new Error('Timeout') });
    });
    
    req.end();
  });
}

// Test 4: Try Signup Endpoint (without actually signing up)
function testSignupEndpoint() {
  return new Promise((resolve) => {
    console.log('📝 Test 4: Signup Endpoint (GET request to check if accessible)');
    console.log('-'.repeat(70));
    
    const signupUrl = `${supabaseUrl}/auth/v1/signup`;
    const url = new URL(signupUrl);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'GET', // GET to check if endpoint exists, won't actually signup
      timeout: 10000,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        // Even if we get an error response, it means the endpoint is reachable
        console.log(`✅ Signup endpoint is reachable`);
        console.log(`   Status Code: ${res.statusCode}`);
        console.log(`   Response: ${data.substring(0, 300)}\n`);
        resolve({ success: true, statusCode: res.statusCode });
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Signup endpoint FAILED`);
      console.log(`   Error: ${err.code} - ${err.message}`);
      console.log(`   URL: ${signupUrl}\n`);
      
      if (err.code === 'ENOTFOUND') {
        console.log('💡 This is the exact error you\'re seeing in the browser!');
        console.log('   The domain does not exist because the project is paused.\n');
      }
      
      resolve({ success: false, error: err });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`❌ Signup endpoint TIMEOUT\n`);
      resolve({ success: false, error: new Error('Timeout') });
    });
    
    req.end();
  });
}

// Test 5: Check Project Status via Supabase REST API
function testRestAPI() {
  return new Promise((resolve) => {
    console.log('🗄️  Test 5: REST API Endpoint');
    console.log('-'.repeat(70));
    
    const restUrl = `${supabaseUrl}/rest/v1/`;
    const url = new URL(restUrl);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'GET',
      timeout: 10000,
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`✅ REST API accessible`);
        console.log(`   Status Code: ${res.statusCode}\n`);
        resolve({ success: true, statusCode: res.statusCode });
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ REST API FAILED`);
      console.log(`   Error: ${err.code} - ${err.message}\n`);
      resolve({ success: false, error: err });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`❌ REST API TIMEOUT\n`);
      resolve({ success: false, error: new Error('Timeout') });
    });
    
    req.end();
  });
}

// Run all tests
async function runAllTests() {
  const dnsOk = await testDNS();
  
  if (!dnsOk) {
    console.log('⚠️  DNS resolution failed. Skipping HTTP tests.\n');
    console.log('='.repeat(70));
    console.log('📊 SUMMARY');
    console.log('='.repeat(70));
    console.log('❌ Supabase project is NOT accessible');
    console.log('💡 SOLUTION: Resume your project in Supabase Dashboard');
    console.log('   https://supabase.com/dashboard/project/gifsrkjqzthenueihs\n');
    return;
  }
  
  const baseResult = await testBaseConnection();
  const authResult = await testAuthHealth();
  const signupResult = await testSignupEndpoint();
  const restResult = await testRestAPI();
  
  console.log('='.repeat(70));
  console.log('📊 SUMMARY');
  console.log('='.repeat(70));
  
  const results = [
    { name: 'DNS Resolution', ok: dnsOk },
    { name: 'Base Connection', ok: baseResult.success },
    { name: 'Auth Health', ok: authResult.success },
    { name: 'Signup Endpoint', ok: signupResult.success },
    { name: 'REST API', ok: restResult.success }
  ];
  
  results.forEach(result => {
    console.log(`${result.ok ? '✅' : '❌'} ${result.name}`);
  });
  
  const allPassed = results.every(r => r.ok);
  
  if (allPassed) {
    console.log('\n✅ All tests passed! Your Supabase project is working correctly.\n');
  } else {
    console.log('\n❌ Some tests failed. Check the details above.\n');
  }
}

runAllTests().catch(console.error);



