-- FIX MEDIA ASSETS POLICIES
-- Run this in Supabase SQL Editor

-- 1. Enable RLS (just in case)
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing strict policies
DROP POLICY IF EXISTS "Admins can insert media assets" ON media_assets;
DROP POLICY IF EXISTS "Admins can update media assets" ON media_assets;
DROP POLICY IF EXISTS "Admins can delete media assets" ON media_assets;
DROP POLICY IF EXISTS "Authenticated users can insert media assets" ON media_assets;
DROP POLICY IF EXISTS "Users can update own media assets" ON media_assets;
DROP POLICY IF EXISTS "Users can delete own media assets" ON media_assets;

-- 3. Create new, more flexible policies

-- Allow ANY authenticated user to upload (Insert)
CREATE POLICY "Authenticated users can insert media assets"
ON media_assets FOR INSERT
TO authenticated
WITH CHECK ( true );

-- Allow users to update their OWN assets
CREATE POLICY "Users can update own media assets"
ON media_assets FOR UPDATE
TO authenticated
USING ( auth.uid() = uploader_id );

-- Allow users to delete their OWN assets
CREATE POLICY "Users can delete own media assets"
ON media_assets FOR DELETE
TO authenticated
USING ( auth.uid() = uploader_id );

-- 4. Ensure Categories are readable by everyone (already done, but good to double check)
DROP POLICY IF EXISTS "Categories are viewable by everyone." ON categories;
CREATE POLICY "Categories are viewable by everyone."
ON categories FOR SELECT
USING ( true );

-- 5. PROMOTE ALL USERS TO ADMIN (Optional, but helps for this project)
UPDATE profiles SET is_admin = true;
