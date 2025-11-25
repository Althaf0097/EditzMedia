-- 1. Add missing columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name text;

-- 2. Force PostgREST to refresh its schema cache
-- This is crucial if you just added columns and Supabase API doesn't see them yet.
NOTIFY pgrst, 'reload config';
