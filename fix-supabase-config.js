// Interactive script to fix Supabase configuration
const fs = require('fs');
const readline = require('readline');
const https = require('https');
const dns = require('dns').promises;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function testURL(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Test DNS
    await dns.resolve4(domain);
    
    // Test HTTPS connection
    return new Promise((resolve) => {
      const req = https.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Supabase-Test/1.0'
        }
      }, (res) => {
        resolve({ success: true, statusCode: res.statusCode });
      });
      
      req.on('error', (err) => {
        resolve({ success: false, error: err.message });
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ success: false, error: 'Timeout' });
      });
    });
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function main() {
  console.log('🔧 Supabase Configuration Fixer\n');
  console.log('='.repeat(70));
  console.log('\nThis script will help you fix your Supabase configuration.\n');
  
  // Read current config
  let currentUrl = '';
  let currentKey = '';
  
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    envContent.split('\n').forEach(line => {
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
        currentUrl = line.split('=')[1].trim();
      }
      if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
        currentKey = line.split('=')[1].trim();
      }
    });
  } catch (err) {
    console.log('❌ Could not read .env.local file');
    process.exit(1);
  }
  
  console.log('📋 Current Configuration:');
  console.log(`   URL: ${currentUrl}`);
  console.log(`   Key: ${currentKey ? currentKey.substring(0, 40) + '...' : 'NOT SET'}\n`);
  
  // Test current URL
  console.log('🧪 Testing current URL...');
  const currentTest = await testURL(currentUrl);
  
  if (currentTest.success) {
    console.log(`✅ Current URL is working! Status: ${currentTest.statusCode}\n`);
    console.log('Your configuration is correct. The issue might be:');
    console.log('1. Browser cache - try hard refresh (Cmd+Shift+R)');
    console.log('2. Dev server needs restart - run: pkill -f "next dev" && npm run dev');
    console.log('3. Environment variables not loaded - restart dev server\n');
    rl.close();
    return;
  }
  
  console.log(`❌ Current URL is NOT working: ${currentTest.error}\n`);
  
  console.log('💡 Your project URL might be incorrect.\n');
  console.log('📝 To find your correct URL:');
  console.log('   1. Go to: https://supabase.com/dashboard');
  console.log('   2. Click on your ACTIVE project');
  console.log('   3. Go to: Settings → API');
  console.log('   4. Copy the "Project URL" (starts with https://)');
  console.log('   5. Copy the "anon public" key\n');
  
  const newUrl = await question('Enter your NEW Supabase Project URL (or press Enter to skip): ');
  
  if (!newUrl || newUrl.trim() === '') {
    console.log('\n⏭️  Skipping URL update. Please update .env.local manually.\n');
    rl.close();
    return;
  }
  
  const urlToTest = newUrl.trim();
  
  // Validate URL format
  if (!urlToTest.startsWith('https://') || !urlToTest.includes('.supabase.co')) {
    console.log('\n❌ Invalid URL format. Should be: https://xxxxx.supabase.co\n');
    rl.close();
    return;
  }
  
  // Test new URL
  console.log('\n🧪 Testing new URL...');
  const newTest = await testURL(urlToTest);
  
  if (!newTest.success) {
    console.log(`❌ New URL also failed: ${newTest.error}\n`);
    console.log('Please verify the URL in Supabase Dashboard.\n');
    rl.close();
    return;
  }
  
  console.log(`✅ New URL is working! Status: ${newTest.statusCode}\n`);
  
  const newKey = await question('Enter your NEW anon key (or press Enter to keep current): ');
  
  // Update .env.local
  try {
    let envContent = fs.readFileSync('.env.local', 'utf8');
    
    // Update URL
    envContent = envContent.replace(
      /NEXT_PUBLIC_SUPABASE_URL=.*/,
      `NEXT_PUBLIC_SUPABASE_URL=${urlToTest}`
    );
    
    // Update key if provided
    if (newKey && newKey.trim() !== '') {
      envContent = envContent.replace(
        /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/,
        `NEXT_PUBLIC_SUPABASE_ANON_KEY=${newKey.trim()}`
      );
    }
    
    fs.writeFileSync('.env.local', envContent);
    
    console.log('\n✅ .env.local updated successfully!\n');
    console.log('📋 New Configuration:');
    console.log(`   URL: ${urlToTest}`);
    console.log(`   Key: ${newKey && newKey.trim() !== '' ? 'Updated' : 'Kept current'}\n`);
    
    console.log('🔄 Next steps:');
    console.log('   1. Restart your dev server:');
    console.log('      pkill -f "next dev"');
    console.log('      npm run dev');
    console.log('   2. Test the connection:');
    console.log('      node test-supabase-api.js');
    console.log('   3. Try signing up in your app\n');
    
  } catch (err) {
    console.log(`\n❌ Error updating .env.local: ${err.message}\n`);
  }
  
  rl.close();
}

main().catch(console.error);



