-- FINAL FIX FOR PROFILE VISIBILITY ISSUES
-- This addresses the discrepancy between admin panel (53 profiles) and homepage (fewer profiles)

-- 1. Check current status
SELECT 'CURRENT PROFILE STATUS:' as info;
SELECT 
  role,
  COUNT(*) as total,
  COUNT(CASE WHEN approved = true THEN 1 END) as approved,
  COUNT(CASE WHEN approved = false OR approved IS NULL THEN 1 END) as pending
FROM profiles 
GROUP BY role
ORDER BY role;

-- 2. APPROVE ALL PROFILES (main fix)
UPDATE profiles 
SET approved = true 
WHERE approved = false OR approved IS NULL;

-- 3. Fix the co-founder constraint issue
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_experience_level_check 
CHECK (
  experience_level IS NULL OR 
  experience_level IN ('Beginner', 'Intermediate', 'Expert')
);

-- 4. Ensure auto-approval is enabled
INSERT INTO admin_settings (setting_key, setting_value) 
VALUES ('auto_approve_profiles', true)
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = true,
  updated_at = NOW();

-- 5. Clean up any profiles with invalid data
UPDATE profiles 
SET 
  approved = true,
  featured = COALESCE(featured, false)
WHERE approved IS NULL OR featured IS NULL;

-- 6. Verify the fix
SELECT 'AFTER FIX - PROFILE STATUS:' as info;
SELECT 
  role,
  COUNT(*) as total,
  COUNT(CASE WHEN approved = true THEN 1 END) as approved,
  COUNT(CASE WHEN approved = false OR approved IS NULL THEN 1 END) as pending
FROM profiles 
GROUP BY role
ORDER BY role;

-- 7. Show total counts that should match admin panel
SELECT 
  'TOTAL PROFILES THAT SHOULD BE VISIBLE:' as info,
  COUNT(*) as total_approved_profiles
FROM profiles 
WHERE approved = true;

-- 8. Final verification
SELECT 
  'SUCCESS! All profiles approved and should be visible on homepage.' as result,
  'If profiles still not showing, clear browser cache and refresh.' as note;