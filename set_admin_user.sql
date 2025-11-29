-- Set admin user
-- Run this in your Supabase SQL Editor
-- IMPORTANT: Replace YOUR_ADMIN_EMAIL with your actual admin email

-- First, remove admin access from everyone
UPDATE profiles SET is_admin = false;

-- Then grant admin access to your admin email
-- REPLACE 'YOUR_ADMIN_EMAIL@example.com' with your actual email
UPDATE profiles 
SET is_admin = true 
WHERE email = 'YOUR_ADMIN_EMAIL@example.com';

-- If the profile doesn't exist yet (user hasn't signed up), 
-- this will set them as admin when they do sign up:
-- You'll need to run this again after they sign up, OR
-- Sign up with this email first, then run this script

-- Verify the admin was set correctly
SELECT id, email, is_admin, created_at 
FROM profiles 
WHERE email = 'YOUR_ADMIN_EMAIL@example.com';

-- This should show is_admin = true for your admin email
-- and is_admin = false for everyone else
