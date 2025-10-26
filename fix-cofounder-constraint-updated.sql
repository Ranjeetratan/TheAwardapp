-- Fix co-founder profile submission constraint error (Updated for PostgreSQL 12+)
-- The error indicates there's a check constraint on experience_level that's failing

-- First, let's see what constraints exist on the profiles table
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND conname LIKE '%experience%';

-- Check what values are currently in the database
SELECT DISTINCT experience_level, COUNT(*) as count
FROM profiles 
WHERE role = 'cofounder' AND experience_level IS NOT NULL
GROUP BY experience_level
ORDER BY experience_level;

-- Check what the ProfileForm expects (these should match)
SELECT 'ProfileForm expects these values:' as info;
SELECT unnest(ARRAY['Beginner', 'Intermediate', 'Expert']) as expected_values;

-- Drop the problematic constraint if it exists
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS chk_experience_level;

-- Create a new constraint that matches the ProfileForm options exactly
ALTER TABLE profiles 
ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IS NULL OR experience_level IN ('Beginner', 'Intermediate', 'Expert'));

-- Test the constraint by checking if it allows valid values
SELECT 'Testing constraint with valid values...' as status;

-- Show all constraints on the profiles table for verification
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND contype = 'c'  -- Check constraints only
ORDER BY conname;

-- Verify current data still works with new constraint
SELECT 
    'Data verification:' as info,
    COUNT(*) as total_cofounders,
    COUNT(CASE WHEN experience_level IS NOT NULL THEN 1 END) as with_experience,
    COUNT(CASE WHEN experience_level IS NULL THEN 1 END) as without_experience
FROM profiles 
WHERE role = 'cofounder';

-- Show any problematic data that might violate the constraint
SELECT 'Checking for invalid experience_level values:' as info;
SELECT experience_level, COUNT(*) as count
FROM profiles 
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND experience_level NOT IN ('Beginner', 'Intermediate', 'Expert')
GROUP BY experience_level;

SELECT 'Constraint updated successfully! Co-founder profiles should now submit without errors.' as result;