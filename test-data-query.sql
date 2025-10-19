-- Test query to check your CofounderBase data
-- Run this in Supabase SQL Editor to see what data you have

-- Check if profiles table exists and has data
SELECT 
  'Profiles Table Check' as test_name,
  COUNT(*) as total_profiles,
  COUNT(*) FILTER (WHERE approved = true) as approved_profiles,
  COUNT(*) FILTER (WHERE role = 'founder') as founders,
  COUNT(*) FILTER (WHERE role = 'cofounder') as cofounders,
  COUNT(*) FILTER (WHERE role = 'investor') as investors,
  COUNT(*) FILTER (WHERE featured = true) as featured_profiles
FROM profiles;

-- Show sample profiles by role
SELECT 
  'Sample Founders' as category,
  id,
  full_name,
  role,
  approved,
  featured,
  startup_name,
  industry,
  created_at
FROM profiles 
WHERE role = 'founder' 
ORDER BY created_at DESC 
LIMIT 3;

SELECT 
  'Sample Cofounders' as category,
  id,
  full_name,
  role,
  approved,
  featured,
  skills_expertise,
  experience_level,
  created_at
FROM profiles 
WHERE role = 'cofounder' 
ORDER BY created_at DESC 
LIMIT 3;

SELECT 
  'Sample Investors' as category,
  id,
  full_name,
  role,
  approved,
  featured,
  investment_range,
  investment_stage,
  created_at
FROM profiles 
WHERE role = 'investor' 
ORDER BY created_at DESC 
LIMIT 3;

-- Check advertisements table
SELECT 
  'Advertisements Check' as test_name,
  COUNT(*) as total_ads,
  COUNT(*) FILTER (WHERE is_active = true) as active_ads
FROM advertisements;

-- Show all profiles with their key info
SELECT 
  'All Profiles Summary' as category,
  full_name,
  email,
  role,
  location,
  availability,
  approved,
  featured,
  CASE 
    WHEN role = 'founder' THEN startup_name
    WHEN role = 'cofounder' THEN skills_expertise
    WHEN role = 'investor' THEN investment_range
  END as role_specific_info,
  created_at
FROM profiles 
ORDER BY featured DESC, created_at DESC;

-- Check for any data issues
SELECT 
  'Data Issues Check' as test_name,
  COUNT(*) FILTER (WHERE role NOT IN ('founder', 'cofounder', 'investor')) as invalid_roles,
  COUNT(*) FILTER (WHERE approved IS NULL) as null_approved,
  COUNT(*) FILTER (WHERE full_name IS NULL OR full_name = '') as missing_names,
  COUNT(*) FILTER (WHERE email IS NULL OR email = '') as missing_emails
FROM profiles;

-- Final verification - this is what the app will query
SELECT 
  'App Query Test - Founders' as test_name,
  COUNT(*) as count
FROM profiles 
WHERE role = 'founder' AND approved = true;

SELECT 
  'App Query Test - Cofounders' as test_name,
  COUNT(*) as count
FROM profiles 
WHERE role = 'cofounder' AND approved = true;

SELECT 
  'App Query Test - Investors' as test_name,
  COUNT(*) as count
FROM profiles 
WHERE role = 'investor' AND approved = true;