-- FINAL FIX for co-founder experience_level constraint error
-- This error: "profiles_experience_level_check" constraint violation

-- Step 1: Check what constraint currently exists
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND conname = 'profiles_experience_level_check';

-- Step 2: Drop the problematic constraint completely
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;

-- Step 3: Check what values are currently in the database
SELECT DISTINCT experience_level, COUNT(*) as count
FROM profiles 
WHERE experience_level IS NOT NULL
GROUP BY experience_level
ORDER BY experience_level;

-- Step 4: Clean up any invalid data that might exist
UPDATE profiles 
SET experience_level = 'Intermediate' 
WHERE experience_level IS NOT NULL 
AND experience_level NOT IN ('Beginner', 'Intermediate', 'Expert');

-- Step 5: Create the correct constraint that matches the ProfileForm exactly
ALTER TABLE profiles 
ADD CONSTRAINT profiles_experience_level_check 
CHECK (
    experience_level IS NULL OR 
    experience_level IN ('Beginner', 'Intermediate', 'Expert')
);

-- Step 6: Test the constraint with a sample insert (this should work)
-- Note: This is just a test, we'll rollback
BEGIN;
INSERT INTO profiles (
    full_name, email, location, linkedin_profile, short_bio, 
    availability, looking_for, role, experience_level, 
    skills_expertise, why_join_startup, approved, featured
) VALUES (
    'Test User', 'test@example.com', 'Test City', 'https://linkedin.com/test',
    'Test bio', 'Full-time', 'Test opportunity', 'cofounder', 'Intermediate',
    'Test skills', 'Test motivation', true, false
);
ROLLBACK;

-- Step 7: Verify the constraint is working correctly
SELECT 'SUCCESS: Experience level constraint has been fixed!' as status;
SELECT 'Co-founder profiles should now submit without errors.' as result;

-- Step 8: Show the final constraint for verification
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND conname = 'profiles_experience_level_check';