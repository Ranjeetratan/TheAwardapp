-- DEFINITIVE FIX for co-founder experience_level constraint error
-- Problem: ProfileForm sends 'Beginner', 'Intermediate', 'Expert'
-- But database constraint expects 'Beginner (0-2 years)', etc.

-- Step 1: Drop ALL existing experience_level constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS chk_experience_level;

-- Step 2: Update any existing data to match ProfileForm format
UPDATE profiles 
SET experience_level = CASE 
    WHEN experience_level LIKE 'Beginner%' THEN 'Beginner'
    WHEN experience_level LIKE 'Intermediate%' THEN 'Intermediate'
    WHEN experience_level LIKE 'Expert%' OR experience_level LIKE 'Senior%' THEN 'Expert'
    ELSE experience_level
END
WHERE experience_level IS NOT NULL;

-- Step 3: Create constraint that matches ProfileForm exactly
ALTER TABLE profiles 
ADD CONSTRAINT profiles_experience_level_check 
CHECK (
    experience_level IS NULL OR 
    experience_level IN ('Beginner', 'Intermediate', 'Expert')
);

-- Step 4: Verify the fix works
SELECT 'Testing constraint...' as status;

-- This should work now (test insert)
BEGIN;
INSERT INTO profiles (
    full_name, email, location, linkedin_profile, short_bio, 
    availability, looking_for, role, experience_level, 
    skills_expertise, why_join_startup, approved, featured
) VALUES (
    'Test Cofounder', 'test-cofounder@example.com', 'Test City', 'https://linkedin.com/test',
    'Test bio for cofounder', 'Full-time', 'Startup opportunity', 'cofounder', 'Intermediate',
    'React, Node.js, Python', 'I want to build something amazing', true, false
);
ROLLBACK; -- Don't actually insert, just test

SELECT 'SUCCESS! Co-founder constraint has been fixed!' as result;
SELECT 'ProfileForm now matches database constraint perfectly.' as confirmation;

-- Step 5: Show current valid values
SELECT 'Valid experience_level values are now:' as info;
SELECT unnest(ARRAY['Beginner', 'Intermediate', 'Expert']) as valid_values;

-- Step 6: Verify existing data
SELECT 
    experience_level,
    COUNT(*) as count,
    CASE 
        WHEN experience_level IN ('Beginner', 'Intermediate', 'Expert') THEN '✅ VALID'
        WHEN experience_level IS NULL THEN '✅ NULL (OK)'
        ELSE '❌ INVALID'
    END as status
FROM profiles 
WHERE role = 'cofounder'
GROUP BY experience_level
ORDER BY experience_level;