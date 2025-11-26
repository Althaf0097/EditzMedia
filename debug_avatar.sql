-- Debug script to check if avatar_url is being saved
-- Run this in Supabase SQL Editor after uploading an avatar

-- Check if avatar_url column exists and has data
SELECT 
    id,
    email,
    display_name,
    avatar_url,
    is_admin,
    created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 5;

-- This will show you:
-- 1. If the avatar_url column exists
-- 2. If your avatar URL was saved
-- 3. All profile data for debugging
