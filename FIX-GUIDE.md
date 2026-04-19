# Fix Guide: Project Active But Still Not Working

## The Problem

Your Supabase project shows as "Active" in the dashboard, but you're still getting `ERR_NAME_NOT_RESOLVED` errors. This usually means **the project reference ID in your `.env.local` file is incorrect**.

## Why This Happens

When you restart/resume a Supabase project, sometimes:
- The project gets a **new reference ID**
- The old project was **deleted and recreated**
- You're looking at a **different project** than what's in your config

## Step-by-Step Fix

### Step 1: Verify Your Project URL in Supabase Dashboard

1. Go to: **https://supabase.com/dashboard**
2. Click on your **ACTIVE project** (the one that shows "Pause" button)
3. Go to: **Settings → API**
4. Look at the **"Project URL"** section
5. **Copy the EXACT URL** shown there
   - Should look like: `https://xxxxx.supabase.co`
   - The `xxxxx` part is your project reference ID

### Step 2: Compare with Your Current Config

Check your `.env.local` file:
```bash
cat .env.local
```

Compare the URL in `.env.local` with the URL from Step 1.

**If they DON'T match**, that's your problem!

### Step 3: Update Your Configuration

#### Option A: Use the Fix Script (Recommended)
```bash
node fix-supabase-config.js
```

This script will:
- Test your current URL
- Let you enter the correct URL
- Update `.env.local` automatically

#### Option B: Manual Update

1. Open `.env.local` in your editor
2. Update the URL:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-correct-project-id.supabase.co
   ```
3. Also copy the **"anon public"** key from Settings → API and update:
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-correct-anon-key
   ```

### Step 4: Restart Dev Server

**IMPORTANT:** You MUST restart the dev server after changing `.env.local`:

```bash
# Kill the current server
pkill -f "next dev"

# Start fresh
npm run dev
```

### Step 5: Verify It Works

1. **Check debug page**: Go to `http://localhost:3000/debug-env`
   - Should show your environment variables
   - Click "Test Supabase Connection" button

2. **Run test script**:
   ```bash
   node test-supabase-api.js
   ```
   Should show: `✅ DNS resolved successfully`

3. **Try signing up**: Go to `http://localhost:3000/signup`
   - Should work without `ERR_NAME_NOT_RESOLVED`

## Common Mistakes

### ❌ Wrong: Not restarting dev server
- Next.js loads env vars at startup
- Changes to `.env.local` require restart

### ❌ Wrong: Using wrong project
- You might have multiple Supabase projects
- Make sure you're using the ACTIVE one

### ❌ Wrong: Copying URL from wrong place
- Don't copy from browser address bar
- Always use: Settings → API → Project URL

### ❌ Wrong: Typo in project ID
- Double-check the project reference ID
- It's case-sensitive

## Quick Diagnostic Commands

```bash
# Check current config
cat .env.local

# Test DNS resolution
dig +short gifsrkjqzthenueihs.supabase.co

# Test API connection
node test-supabase-api.js

# Fix configuration interactively
node fix-supabase-config.js
```

## Still Not Working?

1. **Check browser console**:
   - Open DevTools (F12)
   - Look for the exact error message
   - Check Network tab for failed requests

2. **Verify project is truly active**:
   - In Supabase Dashboard, make sure it says "Active"
   - Not "Paused" or "Inactive"

3. **Try hard refresh**:
   - Mac: Cmd+Shift+R
   - Windows: Ctrl+Shift+R

4. **Clear browser cache**:
   - Sometimes old DNS cache causes issues

5. **Check if project was recreated**:
   - Old project might have been deleted
   - New project has different ID

## Need More Help?

- Visit debug page: `http://localhost:3000/debug-env`
- Run: `node verify-project-url.js`
- Check: `TROUBLESHOOTING.md`





