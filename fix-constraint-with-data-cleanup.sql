-- Fix constraint error by cleaning up existing data first
-- This script handles existing data that violates the constraint

-- 1. First, let's see what experience_level values currently exist
SELECT 'Current experience_level values in database:' as info;
SELECT 
    experience_level, 
    COUNT(*) as count,
    CASE 
        WHEN experience_level IN ('Beginner', 'Intermediate', 'Expert') THEN 'VALID'
        WHEN experience_level IS NULL THEN 'NULL (OK)'
        ELSE 'INVALID - NEEDS FIXING'
    END as status
FROM profiles 
WHERE role = 'cofounder'
GROUP BY experience_level
ORDER BY experience_level;

-- 2. Show the problematic rows that need fixing
SELECT 'Problematic rows that violate the constraint:' as info;
SELECT id, full_name, experience_level
FROM profiles 
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND experience_level NOT IN ('Beginner', 'Intermediate', 'Expert');

-- 3. Fix the problematic data by mapping to valid values
-- Update common variations to proper values
UPDATE profiles 
SET experience_level = 'Beginner'
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND LOWER(experience_level) IN ('beginner', 'junior', 'entry', 'entry-level', 'new', 'starter', '1-2 years', '0-2 years');

UPDATE profiles 
SET experience_level = 'Intermediate'
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND LOWER(experience_level) IN ('intermediate', 'mid', 'mid-level', 'middle', '3-5 years', '2-5 years', 'experienced');

UPDATE profiles 
SET experience_level = 'Expert'
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND LOWER(experience_level) IN ('expert', 'senior', 'advanced', 'lead', 'principal', '5+ years', '10+ years', 'veteran');

-- 4. For any remaining invalid values, set them to NULL (will be handled as optional)
UPDATE profiles 
SET experience_level = NULL
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND experience_level NOT IN ('Beginner', 'Intermediate', 'Expert');

-- 5. Verify all data is now clean
SELECT 'After cleanup - experience_level values:' as info;
SELECT 
    experience_level, 
    COUNT(*) as count,
    CASE 
        WHEN experience_level IN ('Beginner', 'Intermediate', 'Expert') THEN 'VALID'
        WHEN experience_level IS NULL THEN 'NULL (OK)'
        ELSE 'STILL INVALID'
    END as status
FROM profiles 
WHERE role = 'cofounder'
GROUP BY experience_level
ORDER BY experience_level;

-- 6. Now drop any existing constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS chk_experience_level;

-- 7. Create the new constraint (should work now that data is clean)
ALTER TABLE profiles 
ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IS NULL OR experience_level IN ('Beginner', 'Intermediate', 'Expert'));

-- 8. Final verification
SELECT 'Constraint created successfully!' as result;

-- 9. Test that all existing data passes the constraint
SELECT 
    'Final verification - all data should be valid:' as info,
    COUNT(*) as total_cofounders,
    COUNT(CASE WHEN experience_level = 'Beginner' THEN 1 END) as beginners,
    COUNT(CASE WHEN experience_level = 'Intermediate' THEN 1 END) as intermediate,
    COUNT(CASE WHEN experience_level = 'Expert' THEN 1 END) as experts,
    COUNT(CASE WHEN experience_level IS NULL THEN 1 END) as no_experience_specified
FROM profiles 
WHERE role = 'cofounder';

-- 10. Show any remaining issues (should be empty)
SELECT 'Any remaining constraint violations (should be empty):' as info;
SELECT id, full_name, experience_level
FROM profiles 
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND experience_level NOT IN ('Beginner', 'Intermediate', 'Expert');

SELECT 'SUCCESS: Constraint fixed and all data cleaned up!' as final_result;