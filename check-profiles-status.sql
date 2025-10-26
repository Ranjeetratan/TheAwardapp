-- Check current profile status
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN approved = true THEN 1 END) as approved_profiles,
  COUNT(CASE WHEN approved = false OR approved IS NULL THEN 1 END) as unapproved_profiles
FROM profiles;

-- Show all profiles with their approval status
SELECT 
  id,
  full_name,
  role,
  approved,
  featured,
  created_at
FROM profiles 
ORDER BY created_at DESC
LIMIT 20;