-- Set althafs2121@gmail.com as the ONLY admin
-- Run this in your Supabase SQL Editor

-- First, remove admin access from everyone
UPDATE profiles SET is_admin = false;

-- Then grant admin access ONLY to althafs2121@gmail.com
UPDATE profiles 
SET is_admin = true 
WHERE email = 'althafs2121@gmail.com';

-- If the profile doesn't exist yet (user hasn't signed up), 
-- this will set them as admin when they do sign up:
-- You'll need to run this again after they sign up, OR
-- Sign up with this email first, then run this script

-- Verify the admin was set correctly
SELECT id, email, is_admin, created_at 
FROM profiles 
WHERE email = 'althafs2121@gmail.com';

-- This should show is_admin = true for althafs2121@gmail.com
-- and is_admin = false for everyone else
