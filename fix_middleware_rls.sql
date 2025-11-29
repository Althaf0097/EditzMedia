-- ============================================
-- FIX FOR MIDDLEWARE ADMIN CHECK
-- Run this AFTER running security_rls_policies.sql
-- ============================================

-- The issue: Middleware can't check is_admin because RLS blocks it
-- The solution: Add a policy that allows users to read their own is_admin status

-- Add policy to allow users to read their own admin status
CREATE POLICY "Users can check their own admin status"
ON profiles FOR SELECT
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- This policy allows:
-- 1. Users to see their own profile (including is_admin field)
-- 2. Middleware to check if a user is admin
-- 3. Still prevents users from seeing other users' profiles

-- Verify the policy was created
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'profiles' AND policyname = 'Users can check their own admin status';

-- ============================================
-- ALTERNATIVE: If the above doesn't work, use this
-- ============================================

-- Drop the restrictive policy
-- DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Create a more permissive policy
-- CREATE POLICY "Users can view their own profile"
-- ON profiles FOR SELECT
-- USING (auth.uid() = id);

-- ============================================
-- DONE!
-- ============================================
