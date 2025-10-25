-- Approve all pending profiles
-- Run this in your Supabase SQL editor to make all profiles live

UPDATE profiles 
SET approved = true 
WHERE approved = false;

-- Check the results
SELECT 
  role,
  approved,
  COUNT(*) as count
FROM profiles 
GROUP BY role, approved 
ORDER BY role, approved;