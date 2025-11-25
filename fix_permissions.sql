-- COMPREHENSIVE PERMISSION FIX SCRIPT
-- Run this in the Supabase SQL Editor

-- 1. Ensure 'media' bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Reset Storage Policies for 'media' bucket
-- We drop potential existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "User Update Own Files" ON storage.objects;
DROP POLICY IF EXISTS "User Delete Own Files" ON storage.objects;
DROP POLICY IF EXISTS "Give me access" ON storage.objects;

-- Allow public viewing of media
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

-- Allow authenticated users to upload to media
CREATE POLICY "Authenticated Uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'media' );

-- Allow users to update/delete their own files in media
CREATE POLICY "User Update Own Files"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'media' AND auth.uid() = owner );

CREATE POLICY "User Delete Own Files"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'media' AND auth.uid() = owner );

-- 3. Fix Profiles Table Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing update policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Allow users to update their own profile (including avatar_url)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );

-- Ensure profiles are publicly visible (needed for displaying avatars)
DROP POLICY IF EXISTS "Public profiles" ON profiles;
CREATE POLICY "Public profiles"
ON profiles FOR SELECT
USING ( true );
