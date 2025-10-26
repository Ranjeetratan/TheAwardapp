-- Test script to check profile visibility and approve them if needed

-- 1. Check current profile status
SELECT 'CURRENT PROFILE STATUS:' as info;
SELECT 
  role,
  COUNT(*) as total,
  COUNT(CASE WHEN approved = true THEN 1 END) as approved,
  COUNT(CASE WHEN approved = false OR approved IS NULL THEN 1 END) as pending
FROM profiles 
GROUP BY role
ORDER BY role;

-- 2. Show all profiles with their approval status
SELECT 'ALL PROFILES:' as info;
SELECT 
  id,
  full_name,
  role,
  approved,
  featured,
  created_at
FROM profiles 
ORDER BY created_at DESC;

-- 3. If you want to approve all profiles, uncomment the next line:
-- UPDATE profiles SET approved = true WHERE approved = false OR approved IS NULL;

-- 4. After approving, this query shows what should be visible on homepage:
SELECT 'PROFILES THAT SHOULD BE VISIBLE ON HOMEPAGE:' as info;
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

SELECT 'Test completed! If you see profiles above, they should be visible on the homepage.' as result;