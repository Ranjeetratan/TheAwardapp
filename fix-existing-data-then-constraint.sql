-- STEP 1: First, let's see what invalid data exists
SELECT 'Current invalid experience_level values:' as info;
SELECT experience_level, COUNT(*) as count
FROM profiles 
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND experience_level NOT IN ('Beginner', 'Intermediate', 'Expert')
GROUP BY experience_level;

-- STEP 2: Fix the existing invalid data
-- Update any invalid experience_level values to valid ones
UPDATE profiles 
SET experience_level = CASE 
    WHEN experience_level ILIKE '%begin%' OR experience_level ILIKE '%junior%' OR experience_level ILIKE '%entry%' THEN 'Beginner'
    WHEN experience_level ILIKE '%expert%' OR experience_level ILIKE '%senior%' OR experience_level ILIKE '%advanced%' THEN 'Expert'
    WHEN experience_level ILIKE '%inter%' OR experience_level ILIKE '%mid%' THEN 'Intermediate'
    ELSE 'Intermediate'  -- Default fallback
END
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND experience_level NOT IN ('Beginner', 'Intermediate', 'Expert');

-- STEP 3: Drop the problematic constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS chk_experience_level;

-- STEP 4: Now create the correct constraint
ALTER TABLE profiles 
ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IS NULL OR experience_level IN ('Beginner', 'Intermediate', 'Expert'));

-- STEP 5: Verify the fix worked
SELECT 'Verification - All experience_level values after fix:' as info;
SELECT experience_level, COUNT(*) as count
FROM profiles 
WHERE role = 'cofounder' 
GROUP BY experience_level
ORDER BY experience_level;

-- STEP 6: Test that new inserts will work
SELECT 'Testing constraint allows valid values...' as test;

-- Show the constraint is now properly set
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND conname = 'profiles_experience_level_check';

SELECT 'SUCCESS: Co-founder profiles should now submit without errors!' as result;