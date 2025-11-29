# Environment Variables Setup Guide

## 🔐 Local Development (.env.local)

Your `.env.local` file should contain:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:**
- ✅ This file is already in `.gitignore` - it will NOT be committed to GitHub
- ✅ The `NEXT_PUBLIC_` prefix is correct - these values are safe to expose to the browser
- ✅ The Anon Key is protected by Row Level Security (RLS) policies in the database

---

## ☁️ Vercel Production Setup

### Step 1: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add the following variables:

#### Variable 1: Supabase URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project-id.supabase.co
Environments: ✅ Production, ✅ Preview, ✅ Development
```

#### Variable 2: Supabase Anon Key
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: your-anon-key-here
Environments: ✅ Production, ✅ Preview, ✅ Development
```

### Step 2: Redeploy

After adding the environment variables:
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Select **Redeploy**

---

## 🔒 Security Best Practices

### ✅ What You're Doing Right

1. **Environment variables are NOT in your code** - They're in `.env.local` and Vercel settings
2. **`.env.local` is in `.gitignore`** - Never committed to GitHub
3. **Using `NEXT_PUBLIC_` prefix correctly** - These values need to be accessible to the browser
4. **Passwords are encrypted** - Supabase handles this automatically with bcrypt

### ⚠️ Important Security Notes

**The Anon Key is SAFE to expose because:**
- It's protected by Row Level Security (RLS) policies
- Users can only access data they're authorized to see
- The real security comes from your database policies (see `security_rls_policies.sql`)

**Never expose these:**
- ❌ Service Role Key (if you have one) - This has full database access
- ❌ Database passwords
- ❌ API secrets from third-party services

---

## 🗄️ Database Security (Most Important!)

Your environment variables are already secure. The **critical** security step is implementing Row Level Security (RLS) on your database.

**Action Required:**
1. Open Supabase SQL Editor
2. Run the `security_rls_policies.sql` file
3. This will:
   - Enable RLS on all tables
   - Restrict admin operations to users with `is_admin = true`
   - Ensure users can only access their own data

---

## ✅ Security Checklist

- [ ] `.env.local` exists and is in `.gitignore`
- [ ] Environment variables added to Vercel dashboard
- [ ] Vercel project redeployed after adding variables
- [ ] `security_rls_policies.sql` executed in Supabase
- [ ] Admin middleware updated (already done in `middleware.ts`)
- [ ] Security headers added to Next.js (already done in `next.config.ts`)

---

## 🚨 What NOT to Do

❌ **Never** commit `.env.local` to Git
❌ **Never** hardcode API keys in your source code
❌ **Never** use `NEXT_PUBLIC_` for secret keys (only for public ones)
❌ **Never** disable Row Level Security in production
❌ **Never** share your Service Role Key (if you have one)

---

## 📝 Summary

Your current environment variable setup is **already secure**! The main security improvements are:

1. ✅ Add variables to Vercel (you've already done this)
2. ✅ Implement RLS policies (run `security_rls_policies.sql`)
3. ✅ Update middleware for admin checks (already done)
4. ✅ Add security headers (already done)

**Passwords are automatically encrypted by Supabase** - you don't need to do anything for this!
