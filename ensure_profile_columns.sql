-- Ensure avatar_url and display_name columns exist in profiles table
-- Run this in your Supabase SQL Editor

-- Add avatar_url column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Add display_name column if it doesn't exist  
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS display_name text;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('avatar_url', 'display_name', 'email', 'is_admin');

-- This should show all 4 columns
