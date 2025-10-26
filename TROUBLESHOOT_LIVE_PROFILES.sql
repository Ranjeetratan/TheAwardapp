-- TROUBLESHOOT PROFILE VISIBILITY ISSUES
-- Run this to diagnose why profiles might not be showing

-- 1. Check if profiles table exists and has data
SELECT 'PROFILES TABLE CHECK:' as info;
SELECT 
  COUNT(*) as total_profiles,
  MIN(created_at) as oldest_profile,
  MAX(created_at) as newest_profile
FROM profiles;

-- 2. Check approval status breakdown
SELECT 'APPROVAL STATUS BREAKDOWN:' as info;
SELECT 
  approved,
  COUNT(*) as count
FROM profiles 
GROUP BY approved
ORDER BY approved;

-- 3. Check role distribution
SELECT 'ROLE DISTRIBUTION:' as info;
SELECT 
  role,
  COUNT(*) as count,
  COUNT(CASE WHEN approved = true THEN 1 END) as approved_count
FROM profiles 
GROUP BY role
ORDER BY role;

-- 4. Check for any NULL or empty required fields
SELECT 'PROFILES WITH MISSING REQUIRED FIELDS:' as info;
SELECT 
  id,
  full_name,
  role,
  approved,
  CASE 
    WHEN full_name IS NULL OR full_name = '' THEN 'Missing name'
    WHEN role IS NULL OR role = '' THEN 'Missing role'
    WHEN approved IS NULL THEN 'NULL approval status'
    ELSE 'OK'
  END as issue
FROM profiles
WHERE 
  full_name IS NULL OR full_name = '' OR
  role IS NULL OR role = '' OR
  approved IS NULL;

-- 5. Check RLS policies on profiles table
SELECT 'RLS STATUS ON PROFILES TABLE:' as info;
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles';

-- 6. Show sample of each role type
SELECT 'SAMPLE FOUNDERS:' as info;
SELECT id, full_name, approved, created_at
FROM profiles 
WHERE role = 'founder'
ORDER BY created_at DESC
LIMIT 5;

SELECT 'SAMPLE COFOUNDERS:' as info;
SELECT id, full_name, approved, created_at
FROM profiles 
WHERE role = 'cofounder'
ORDER BY created_at DESC
LIMIT 5;

SELECT 'SAMPLE INVESTORS:' as info;
SELECT id, full_name, approved, created_at
FROM profiles 
WHERE role = 'investor'
ORDER BY created_at DESC
LIMIT 5;

-- 7. Check admin settings
SELECT 'AUTO-APPROVAL SETTING:' as info;
SELECT * FROM admin_settings WHERE setting_key = 'auto_approve_profiles';

-- 8. Final recommendation
SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM profiles WHERE approved = true) > 0 
    THEN 'Profiles are approved. If still not visible, check frontend cache or RLS policies.'
    ELSE 'No approved profiles found. Run APPROVE_ALL_LIVE_PROFILES.sql first.'
  END as recommendation;