-- FINAL FIX SCRIPT
-- Run this in Supabase SQL Editor

-- 1. Add ALL missing columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name text;

-- 2. Force Schema Cache Reload
NOTIFY pgrst, 'reload config';

-- 3. VERIFICATION QUERY
-- This should return 2 rows showing both columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('avatar_url', 'display_name')
ORDER BY column_name;
