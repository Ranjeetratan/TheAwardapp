-- Debug query to check profile approval status by role

-- Count all profiles by role and approval status
SELECT 
  role,
  approved,
  COUNT(*) as count
FROM profiles 
GROUP BY role, approved 
ORDER BY role, approved;

-- Show specific profiles that are not approved
SELECT 
  id,
  full_name,
  email,
  role,
  approved,
  created_at
FROM profiles 
WHERE approved = false
ORDER BY created_at DESC;

-- Show approved profiles by role
SELECT 
  role,
  COUNT(*) as approved_count
FROM profiles 
WHERE approved = true
GROUP BY role
ORDER BY role;