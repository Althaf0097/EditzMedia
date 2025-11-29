-- ============================================
-- SECURITY IMPLEMENTATION SQL SCRIPT
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Enable Row Level Security on all tables
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies (if any) to avoid conflicts
-- ============================================

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view published media" ON media_assets;
DROP POLICY IF EXISTS "Only admins can insert media" ON media_assets;
DROP POLICY IF EXISTS "Only admins can update media" ON media_assets;
DROP POLICY IF EXISTS "Only admins can delete media" ON media_assets;
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Only admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Users can view their own saved items" ON saved_items;
DROP POLICY IF EXISTS "Users can add their own saved items" ON saved_items;
DROP POLICY IF EXISTS "Users can delete their own saved items" ON saved_items;

-- Step 3: PROFILES TABLE POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile (but not is_admin field)
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Step 4: MEDIA ASSETS TABLE POLICIES
-- ============================================

-- Anyone (authenticated or not) can view published media
CREATE POLICY "Anyone can view published media"
ON media_assets FOR SELECT
USING (true);

-- Only admins can insert new media
CREATE POLICY "Only admins can insert media"
ON media_assets FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Only admins can update media
CREATE POLICY "Only admins can update media"
ON media_assets FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Only admins can delete media
CREATE POLICY "Only admins can delete media"
ON media_assets FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Step 5: CATEGORIES TABLE POLICIES
-- ============================================

-- Anyone can view categories
CREATE POLICY "Anyone can view categories"
ON categories FOR SELECT
USING (true);

-- Only admins can insert categories
CREATE POLICY "Only admins can insert categories"
ON categories FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Only admins can update categories
CREATE POLICY "Only admins can update categories"
ON categories FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Only admins can delete categories
CREATE POLICY "Only admins can delete categories"
ON categories FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Step 6: SAVED ITEMS TABLE POLICIES
-- ============================================

-- Users can view their own saved items
CREATE POLICY "Users can view their own saved items"
ON saved_items FOR SELECT
USING (auth.uid() = user_id);

-- Users can add their own saved items
CREATE POLICY "Users can add their own saved items"
ON saved_items FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved items
CREATE POLICY "Users can delete their own saved items"
ON saved_items FOR DELETE
USING (auth.uid() = user_id);

-- Step 7: STORAGE BUCKET POLICIES
-- ============================================
-- Note: Run these separately in the Storage section of Supabase Dashboard

-- For the 'media' bucket:
-- 1. Go to Storage > media bucket > Policies
-- 2. Create these policies:

-- Policy 1: Public read access
-- CREATE POLICY "Public read access"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'media');

-- Policy 2: Admin upload access
-- CREATE POLICY "Admin upload access"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'media' AND
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE id = auth.uid() AND is_admin = true
--   )
-- );

-- Policy 3: Admin delete access
-- CREATE POLICY "Admin delete access"
-- ON storage.objects FOR DELETE
-- USING (
--   bucket_id = 'media' AND
--   EXISTS (
--     SELECT 1 FROM profiles
--     WHERE id = auth.uid() AND is_admin = true
--   )
-- );

-- ============================================
-- VERIFICATION QUERIES
-- Run these to verify the policies are working
-- ============================================

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'media_assets', 'categories', 'saved_items');

-- List all policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'media_assets', 'categories', 'saved_items')
ORDER BY tablename, policyname;

-- ============================================
-- DONE! Your database is now secured with RLS
-- ============================================
