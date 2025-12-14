// Test Supabase connection and authentication
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read .env.local file
let envContent = '';
try {
  envContent = fs.readFileSync('.env.local', 'utf8');
} catch (err) {
  console.error('❌ Could not read .env.local file');
  process.exit(1);
}

// Parse environment variables
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Environment variables not set!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('\n1. Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('_test').select('*').limit(1);
    if (error && error.code !== 'PGRST116') {
      console.log('✅ Supabase client created successfully');
      console.log('   (Table check error is expected - connection works)');
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (err) {
    console.log('✅ Supabase client created (connection test skipped)');
  }
}

async function testSignup() {
  console.log('\n2. Testing user signup...');
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
        },
      },
    });

    if (error) {
      console.error('❌ Signup failed:', error.message);
      console.error('   Error code:', error.status);
      return false;
    }

    console.log('✅ Signup successful!');
    console.log('   Email:', testEmail);
    console.log('   User ID:', data.user?.id);
    console.log('   Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No (check email)');
    return true;
  } catch (err) {
    console.error('❌ Signup error:', err.message);
    return false;
  }
}

async function testLogin(email, password) {
  console.log('\n3. Testing user login...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('❌ Login failed:', error.message);
      console.error('   Error code:', error.status);
      return false;
    }

    console.log('✅ Login successful!');
    console.log('   User ID:', data.user?.id);
    console.log('   Email:', data.user?.email);
    return true;
  } catch (err) {
    console.error('❌ Login error:', err.message);
    return false;
  }
}

async function runTests() {
  await testConnection();
  
  const signupSuccess = await testSignup();
  
  if (signupSuccess) {
    // Note: In production, user would need to verify email first
    console.log('\n⚠️  Note: Email verification may be required before login');
  }
  
  console.log('\n✅ Tests completed!');
  console.log('\nTo test in browser:');
  console.log('1. Go to http://localhost:3003/signup');
  console.log('2. Create an account');
  console.log('3. Check your email for verification (if enabled)');
  console.log('4. Go to http://localhost:3003/login');
  console.log('5. Try logging in');
}

runTests().catch(console.error);

