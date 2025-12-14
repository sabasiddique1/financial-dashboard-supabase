// Quick Supabase Status Check
const SUPABASE_URL = 'https://gifsrkjqzthenueihs.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpZnNya2pxenRoZXdlbnVlaWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTE1MTYsImV4cCI6MjA2OTk4NzUxNn0.p7wZ_MEN6L51FcI_1cKMHdheAF7TIi7NMsaZ_5lOBE0';

console.log('🔍 Checking Supabase Status...\n');
console.log('URL:', SUPABASE_URL);
console.log('Key:', SUPABASE_KEY.substring(0, 30) + '...\n');

// Test 1: Check if URL is reachable
async function checkURL() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (response.ok || response.status === 404) {
      console.log('✅ Supabase URL is reachable');
      console.log('   Status:', response.status);
      return true;
    } else {
      console.log('⚠️  Supabase URL responded with:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot reach Supabase URL');
    console.log('   Error:', error.message);
    console.log('\n💡 This might be a network issue or the project might be paused.');
    return false;
  }
}

// Test 2: Check Auth endpoint
async function checkAuth() {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY
      }
    });
    
    if (response.ok) {
      console.log('✅ Auth endpoint is accessible');
      return true;
    } else {
      console.log('⚠️  Auth endpoint status:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot reach Auth endpoint');
    console.log('   Error:', error.message);
    return false;
  }
}

async function runChecks() {
  console.log('Test 1: Checking Supabase URL...');
  const urlOk = await checkURL();
  
  console.log('\nTest 2: Checking Auth endpoint...');
  const authOk = await checkAuth();
  
  console.log('\n' + '='.repeat(50));
  if (urlOk && authOk) {
    console.log('✅ Supabase appears to be working!');
    console.log('\n📝 Next steps:');
    console.log('   1. Visit http://localhost:3003/test-auth');
    console.log('   2. Try creating a test account');
    console.log('   3. Check browser console for any errors');
  } else {
    console.log('⚠️  Some checks failed. Possible issues:');
    console.log('   - Project might be paused in Supabase dashboard');
    console.log('   - Network connectivity issue');
    console.log('   - URL or key might be incorrect');
    console.log('\n💡 Check: https://supabase.com/dashboard/project/gifsrkjqzthenueihs');
  }
  console.log('='.repeat(50));
}

runChecks();

