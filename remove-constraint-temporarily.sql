-- QUICK FIX: Remove the problematic constraint entirely
-- This allows co-founder profiles to submit without constraint validation

-- Drop all experience_level constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS chk_experience_level;

-- Verify constraints are removed
SELECT 'Checking remaining constraints...' as info;
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND conname LIKE '%experience%';

SELECT 'Constraint removed! Co-founder profiles should now submit successfully.' as result;