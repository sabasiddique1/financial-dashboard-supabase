# Fix: "Email address is invalid" Error

## The Problem

You're getting this error when trying to sign up:
```
Email address "test@gmail.com" is invalid
Error code: email_address_invalid
```

## Why This Happens

Supabase may reject certain email addresses due to:

1. **Email Domain Restrictions** - Some Supabase projects block common test domains (like `gmail.com`, `test.com`, etc.)
2. **Email Validation Rules** - Supabase has strict email validation that might reject certain formats
3. **Project Configuration** - Your Supabase project might have email restrictions enabled

## Solutions

### Solution 1: Try a Different Email Address

Try using a different email format or domain:

**Good options:**
- `yourname@example.com`
- `test@yourdomain.com` (if you own a domain)
- `user123@mail.com`
- `test.user@outlook.com`

**Avoid:**
- `test@gmail.com` (common test email, might be blocked)
- `test@test.com` (test domain, often blocked)
- Disposable email services

### Solution 2: Check Supabase Email Settings

1. Go to: **https://supabase.com/dashboard/project/gifsrkjqzthewenueihs**
2. Navigate to: **Authentication → Settings**
3. Look for:
   - **Email Domain Restrictions** - Make sure your email domain isn't blocked
   - **Email Validation** - Check if there are any validation rules
   - **Email Templates** - Ensure email sending is configured

### Solution 3: Disable Email Confirmation (For Testing)

If you're just testing, you can temporarily disable email confirmation:

1. Go to: **Authentication → Settings**
2. Find: **"Enable email confirmations"**
3. **Disable** it temporarily
4. Try signing up again

**Note:** Re-enable this for production!

### Solution 4: Use a Real Email Address

If you're testing with `test@gmail.com`, try:
- Using your actual email address
- Creating a test account with a real email provider
- Using a custom domain email if you have one

## Quick Test

Try signing up with one of these emails:
- `user@example.com`
- `test123@mail.com`
- `yourname@outlook.com`

If these work, the issue is likely email domain restrictions.

## Still Not Working?

1. **Check Supabase Dashboard Logs:**
   - Go to: **Logs → Auth Logs**
   - Look for the exact error message
   - Check if there are any patterns

2. **Verify Email Format:**
   - Make sure email is lowercase
   - No spaces before/after
   - Valid format: `name@domain.com`

3. **Contact Supabase Support:**
   - If the issue persists, contact Supabase support
   - Provide the error code: `email_address_invalid`
   - Mention your project ID: `gifsrkjqzthewenueihs`

## Common Email Domains That Work

- `@example.com`
- `@mail.com`
- `@outlook.com`
- `@yahoo.com`
- `@protonmail.com`
- Custom domains (if you own them)

## Common Email Domains That Might Be Blocked

- `@test.com`
- `@testmail.com`
- `@guerrillamail.com` (disposable)
- `@tempmail.com` (disposable)
- Some `@gmail.com` addresses (if flagged as test accounts)





