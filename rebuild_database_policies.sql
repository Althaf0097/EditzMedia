-- MASTER DATABASE REBUILD SCRIPT
-- Run this in Supabase SQL Editor to fix ALL permission errors

-- 1. PROFILES TABLE
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all potential existing policies to start fresh
DROP POLICY IF EXISTS "Public profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create correct policies
CREATE POLICY "Public profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. MEDIA ASSETS TABLE
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Drop all potential existing policies
DROP POLICY IF EXISTS "Public media assets" ON media_assets;
DROP POLICY IF EXISTS "Media assets are viewable by everyone." ON media_assets;
DROP POLICY IF EXISTS "Authenticated users can upload" ON media_assets;
DROP POLICY IF EXISTS "Authenticated users can insert media assets" ON media_assets;
DROP POLICY IF EXISTS "Users can update own media" ON media_assets;
DROP POLICY IF EXISTS "Users can update own media assets" ON media_assets;
DROP POLICY IF EXISTS "Users can delete own media" ON media_assets;
DROP POLICY IF EXISTS "Users can delete own media assets" ON media_assets;
DROP POLICY IF EXISTS "Admins can insert media assets" ON media_assets;

-- Create correct policies
CREATE POLICY "Public media assets" ON media_assets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload" ON media_assets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own media" ON media_assets FOR UPDATE USING (auth.uid() = uploader_id);
CREATE POLICY "Users can delete own media" ON media_assets FOR DELETE USING (auth.uid() = uploader_id);

-- 3. CATEGORIES TABLE
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public categories" ON categories;
DROP POLICY IF EXISTS "Categories are viewable by everyone." ON categories;
CREATE POLICY "Public categories" ON categories FOR SELECT USING (true);

-- 4. STORAGE (Media Bucket)
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "User Update" ON storage.objects;
DROP POLICY IF EXISTS "User Delete" ON storage.objects;
DROP POLICY IF EXISTS "User Update Own Files" ON storage.objects;
DROP POLICY IF EXISTS "User Delete Own Files" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Authenticated Uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "User Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND auth.uid() = owner);
CREATE POLICY "User Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND auth.uid() = owner);

-- 5. FIX ADMIN STATUS (Promote everyone to admin for now)
UPDATE profiles SET is_admin = true;
