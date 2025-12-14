# Production Setup Guide for Supabase

## 1. Add Production URL to Supabase

### Step 1: Go to Supabase Dashboard
1. Visit https://supabase.com/dashboard
2. Select your project: `gifsrkjqzthenueihs`

### Step 2: Configure Authentication URLs
1. Go to **Authentication** → **URL Configuration**
2. You'll see these settings:

#### Site URL
- **Add your production domain**: `https://yourdomain.com`
- This is the main URL where your app is hosted
- Example: `https://financial-dashboard.vercel.app`

#### Redirect URLs
Add all URLs where users can be redirected after authentication:
- `https://yourdomain.com`
- `https://yourdomain.com/dashboard`
- `https://yourdomain.com/login`
- `https://yourdomain.com/signup`
- `https://yourdomain.com/**` (wildcard for all routes)

### Step 3: Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Update email templates to use your production URL
3. Replace `localhost:3000` with your production domain in:
   - Confirm signup email
   - Magic link email
   - Password reset email

## 2. Environment Variables for Production

### For Vercel/Netlify/Other Hosting:
Add these environment variables in your hosting platform:

```env
NEXT_PUBLIC_SUPABASE_URL=https://gifsrkjqzthenueihs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpZnNya2pxenRoZXdlbnVlaWhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MTE1MTYsImV4cCI6MjA2OTk4NzUxNn0.p7wZ_MEN6L51FcI_1cKMHdheAF7TIi7NMsaZ_5lOBE0
```

### Important Notes:
- ✅ These are **public** variables (safe to expose)
- ✅ The `NEXT_PUBLIC_` prefix makes them available in the browser
- ❌ Never expose your **service role key** (keep it secret!)

## 3. Production Checklist

### Supabase Configuration:
- [ ] Site URL set to production domain
- [ ] Redirect URLs include all necessary routes
- [ ] Email templates updated with production URL
- [ ] Email confirmation settings configured (enable/disable as needed)
- [ ] CORS settings allow your production domain

### Application:
- [ ] Environment variables set in hosting platform
- [ ] `.env.local` is NOT committed to git (already in .gitignore)
- [ ] Test authentication flow on production
- [ ] Test signup, login, and logout
- [ ] Verify email confirmation works (if enabled)

## 4. Common Hosting Platforms

### Vercel:
1. Go to your project → **Settings** → **Environment Variables**
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Select **Production**, **Preview**, and **Development** environments
4. Redeploy your application

### Netlify:
1. Go to **Site settings** → **Environment variables**
2. Add the variables
3. Redeploy

### Other Platforms:
- Add environment variables in your platform's settings
- Make sure they're available at build time and runtime

## 5. Testing Production Setup

After deployment:
1. Visit your production URL
2. Try signing up with a new account
3. Check email for verification (if enabled)
4. Try logging in
5. Verify redirects work correctly

## 6. Troubleshooting

### "Invalid redirect URL" error:
- Make sure your production URL is in Supabase's Redirect URLs list
- Include the protocol (`https://`)
- Don't include trailing slashes

### "Email not sending":
- Check Supabase → Settings → Auth → Email settings
- Verify SMTP is configured (or use Supabase's default)
- Check spam folder

### "CORS error":
- Supabase automatically allows your Site URL
- Make sure Site URL matches exactly (including https)

## 7. Security Best Practices

1. **Never commit** `.env.local` to git ✅ (already in .gitignore)
2. **Use environment variables** in your hosting platform
3. **Enable Row Level Security (RLS)** in Supabase for your tables
4. **Use HTTPS** in production (required for Supabase)
5. **Keep service role key secret** (never expose in frontend)

