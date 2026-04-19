// Diagnostic script to check Supabase connection
const https = require('https');
const dns = require('dns').promises;
const fs = require('fs');

console.log('🔍 Supabase Connection Diagnostic\n');
console.log('='.repeat(60));

// Read .env.local
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
  
  console.log('✅ .env.local file found');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseKey ? 'Set (' + supabaseKey.substring(0, 20) + '...)' : 'NOT SET'}\n`);
} catch (err) {
  console.log('❌ Could not read .env.local file');
  console.log('   Error:', err.message);
  process.exit(1);
}

// Extract domain from URL
const urlObj = new URL(supabaseUrl);
const domain = urlObj.hostname;

console.log('🌐 DNS Resolution Test');
console.log('='.repeat(60));

dns.resolve4(domain)
  .then(addresses => {
    console.log(`✅ DNS resolved successfully`);
    console.log(`   IP addresses: ${addresses.join(', ')}\n`);
    
    // Test HTTPS connection
    console.log('🔗 HTTPS Connection Test');
    console.log('='.repeat(60));
    
    const req = https.get(supabaseUrl, (res) => {
      console.log(`✅ HTTPS connection successful`);
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Headers: ${JSON.stringify(res.headers, null, 2).substring(0, 200)}...\n`);
      
      console.log('✅ All checks passed! Your Supabase project appears to be active.\n');
      process.exit(0);
    });
    
    req.on('error', (err) => {
      console.log(`❌ HTTPS connection failed`);
      console.log(`   Error: ${err.message}\n`);
      
      if (err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') {
        console.log('💡 SOLUTION:');
        console.log('   1. Go to https://supabase.com/dashboard');
        console.log('   2. Check if your project is paused');
        console.log('   3. If paused, click "Resume" or "Restore"');
        console.log('   4. Verify the project URL matches:', supabaseUrl);
        console.log('   5. If the project was deleted, create a new one\n');
      }
      
      process.exit(1);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log('❌ Connection timeout');
      process.exit(1);
    });
  })
  .catch(err => {
    console.log(`❌ DNS resolution failed`);
    console.log(`   Error: ${err.message}\n`);
    
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') {
      console.log('💡 ROOT CAUSE: The Supabase project domain does not exist.');
      console.log('   This usually means:\n');
      console.log('   1. ❌ The project is PAUSED in Supabase dashboard');
      console.log('   2. ❌ The project was DELETED');
      console.log('   3. ❌ The project reference ID is INCORRECT\n');
      
      console.log('💡 SOLUTION:');
      console.log('   1. Go to: https://supabase.com/dashboard');
      console.log('   2. Look for project: gifsrkjqzthenueihs');
      console.log('   3. If you see "Paused" status, click "Resume"');
      console.log('   4. If project doesn\'t exist, create a new one');
      console.log('   5. Copy the correct Project URL from Settings → API');
      console.log('   6. Update your .env.local file with the correct URL\n');
      
      console.log('📝 To get your correct Supabase URL:');
      console.log('   1. Go to Supabase Dashboard → Your Project');
      console.log('   2. Settings → API');
      console.log('   3. Copy "Project URL" (should look like: https://xxxxx.supabase.co)');
      console.log('   4. Copy "anon public" key');
      console.log('   5. Update .env.local with these values\n');
    }
    
    process.exit(1);
  });





