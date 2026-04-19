# Troubleshooting: ERR_NAME_NOT_RESOLVED Error

## The Problem

You're seeing this error repeatedly:
```
POST https://gifsrkjqzthenueihs.supabase.co/auth/v1/signup net::ERR_NAME_NOT_RESOLVED
```

## Root Cause

The DNS lookup for `gifsrkjqzthenueihs.supabase.co` is failing with `NXDOMAIN` (domain does not exist). This means:

**Your Supabase project is either:**
1. ❌ **PAUSED** - Most common reason. Free tier projects pause after inactivity
2. ❌ **DELETED** - Project was removed
3. ❌ **Wrong Project ID** - The reference ID in your URL is incorrect

## Quick Fix Steps

### Step 1: Check Your Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Look for your project with ID: `gifsrkjqzthenueihs`
3. Check the project status

### Step 2: If Project is Paused

1. Click on the paused project
2. Click **"Resume"** or **"Restore"** button
3. Wait 1-2 minutes for the project to become active
4. The DNS will automatically resolve once active

### Step 3: If Project Doesn't Exist

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **Settings → API**
3. Copy the **Project URL** (looks like: `https://xxxxx.supabase.co`)
4. Copy the **anon public** key
5. Update your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-new-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
```

6. Restart your dev server:
```bash
# Kill the server
pkill -f "next dev"

# Start again
npm run dev
```

### Step 4: Verify Connection

Run the diagnostic script:
```bash
node check-supabase-connection.js
```

This will tell you if your project is accessible.

## Why This Keeps Happening

### Free Tier Projects Auto-Pause

Supabase free tier projects automatically pause after **7 days of inactivity** to save resources. When paused:
- The domain stops resolving (DNS fails)
- All API endpoints become unavailable
- You'll see `ERR_NAME_NOT_RESOLVED` errors

### How to Prevent Auto-Pause

1. **Upgrade to Pro** - Pro projects don't auto-pause
2. **Keep Project Active** - Use it at least once every 7 days
3. **Set Up Monitoring** - Use Supabase's monitoring to keep it active

## Testing Your Fix

After resuming/creating your project:

1. **Run diagnostic:**
   ```bash
   node check-supabase-connection.js
   ```
   Should show: `✅ DNS resolved successfully`

2. **Test in browser:**
   - Go to `http://localhost:3000/signup`
   - Try creating an account
   - Should work without `ERR_NAME_NOT_RESOLVED`

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for successful API calls to Supabase
   - No more DNS errors

## Common Issues

### Issue: "Project not found in dashboard"
**Solution:** The project was deleted. Create a new one and update `.env.local`

### Issue: "Resume button doesn't work"
**Solution:** 
- Wait a few minutes and try again
- Check if you've hit the free tier limit
- Contact Supabase support

### Issue: "Still getting errors after resume"
**Solution:**
- Wait 2-3 minutes for DNS propagation
- Clear browser cache
- Restart your dev server
- Verify the URL in `.env.local` matches dashboard exactly

## Need More Help?

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase GitHub](https://github.com/supabase/supabase)





