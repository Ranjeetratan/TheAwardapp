-- Approve all existing profiles to make them visible on the homepage
UPDATE profiles 
SET approved = true 
WHERE approved = false OR approved IS NULL;

-- Verify the update
SELECT 
  id,
  full_name,
  role,
  approved,
  created_at
FROM profiles 
ORDER BY created_at DESC;

-- Count approved vs unapproved profiles
SELECT 
  approved,
  COUNT(*) as count
FROM profiles 
GROUP BY approved;