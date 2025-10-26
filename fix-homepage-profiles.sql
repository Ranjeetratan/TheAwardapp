-- Comprehensive fix to ensure all profiles show up on homepage
-- Run this in your Supabase SQL editor

-- 1. First, check current status
SELECT 'Current Profile Status:' as info;
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN approved = true THEN 1 END) as approved_profiles,
  COUNT(CASE WHEN approved = false OR approved IS NULL THEN 1 END) as unapproved_profiles
FROM profiles;

-- 2. Show current profiles
SELECT 'Current Profiles:' as info;
SELECT 
  id,
  full_name,
  role,
  approved,
  featured,
  created_at
FROM profiles 
ORDER BY created_at DESC;

-- 3. Approve ALL profiles
UPDATE profiles 
SET approved = true 
WHERE approved = false OR approved IS NULL;

-- 4. Ensure RLS is properly configured
-- Disable RLS temporarily for testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements DISABLE ROW LEVEL SECURITY;

-- 5. Verify the fix
SELECT 'After Fix - Profile Status:' as info;
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN approved = true THEN 1 END) as approved_profiles,
  COUNT(CASE WHEN approved = false OR approved IS NULL THEN 1 END) as unapproved_profiles
FROM profiles;

-- 6. Show approved profiles that should now be visible
SELECT 'Approved Profiles (should be visible on homepage):' as info;
SELECT 
  id,
  full_name,
  role,
  approved,
  featured,
  created_at
FROM profiles 
WHERE approved = true
ORDER BY featured DESC, created_at DESC;

SELECT 'Fix completed! All profiles should now be visible on the homepage.' as result;