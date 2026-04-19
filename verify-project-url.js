// Script to help verify the correct Supabase project URL
console.log('🔍 Supabase Project URL Verification Guide\n');
console.log('='.repeat(70));
console.log('\n📋 Your Current Configuration:');
console.log('   Project Reference ID: gifsrkjqzthenueihs');
console.log('   Full URL: https://gifsrkjqzthenueihs.supabase.co\n');

console.log('⚠️  IMPORTANT: If your project shows as "Active" but DNS fails,');
console.log('   the project reference ID might be incorrect.\n');

console.log('🔧 How to Verify Your Correct Project URL:\n');
console.log('1. Go to: https://supabase.com/dashboard');
console.log('2. Click on your project');
console.log('3. Go to: Settings → API');
console.log('4. Look for "Project URL" section');
console.log('5. Copy the EXACT URL shown there');
console.log('   (It should look like: https://xxxxx.supabase.co)\n');

console.log('💡 Common Issues:\n');
console.log('   ❌ Project was recreated → New project has different ID');
console.log('   ❌ Copied wrong project ID → Check Settings → API');
console.log('   ❌ Project region changed → URL might be different');
console.log('   ❌ Multiple projects → Using wrong project ID\n');

console.log('📝 Next Steps:\n');
console.log('1. Verify the Project URL in Supabase Dashboard');
console.log('2. If URL is different, update .env.local:');
console.log('   NEXT_PUBLIC_SUPABASE_URL=<correct-url-from-dashboard>');
console.log('3. Also copy the "anon public" key from Settings → API');
console.log('4. Restart your dev server\n');

console.log('🧪 After updating, run: node test-supabase-api.js\n');





