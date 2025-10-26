-- Check all constraints on profiles table to prevent future issues
-- Run this to see all current constraints and identify potential problems

-- 1. Show all check constraints on profiles table
SELECT 
    'Current Check Constraints on profiles table:' as info;

SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND contype = 'c'  -- Check constraints only
ORDER BY conname;

-- 2. Check for any data that might violate common constraints
SELECT 'Checking for potential constraint violations:' as info;

-- Check experience_level values
SELECT 'Experience Level Values:' as field;
SELECT experience_level, COUNT(*) as count
FROM profiles 
WHERE role = 'cofounder' AND experience_level IS NOT NULL
GROUP BY experience_level
ORDER BY experience_level;

-- Check availability values
SELECT 'Availability Values:' as field;
SELECT availability, COUNT(*) as count
FROM profiles 
WHERE availability IS NOT NULL
GROUP BY availability
ORDER BY availability;

-- Check role values
SELECT 'Role Values:' as field;
SELECT role, COUNT(*) as count
FROM profiles 
WHERE role IS NOT NULL
GROUP BY role
ORDER BY role;

-- Check startup_stage values (for founders)
SELECT 'Startup Stage Values:' as field;
SELECT startup_stage, COUNT(*) as count
FROM profiles 
WHERE role = 'founder' AND startup_stage IS NOT NULL
GROUP BY startup_stage
ORDER BY startup_stage;

-- Check investment_range values (for investors)
SELECT 'Investment Range Values:' as field;
SELECT investment_range, COUNT(*) as count
FROM profiles 
WHERE role = 'investor' AND investment_range IS NOT NULL
GROUP BY investment_range
ORDER BY investment_range;

-- Check investment_stage values (for investors)
SELECT 'Investment Stage Values:' as field;
SELECT investment_stage, COUNT(*) as count
FROM profiles 
WHERE role = 'investor' AND investment_stage IS NOT NULL
GROUP BY investment_stage
ORDER BY investment_stage;

-- 3. Show table structure
SELECT 'Profiles table structure:' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

SELECT 'Constraint check completed!' as result;