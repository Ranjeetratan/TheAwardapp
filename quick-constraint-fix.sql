-- Quick fix for constraint violation - handles most common cases

-- 1. Check what's causing the constraint violation
SELECT 'Checking problematic experience_level values:' as info;
SELECT experience_level, COUNT(*) as count
FROM profiles 
WHERE role = 'cofounder' AND experience_level IS NOT NULL
GROUP BY experience_level
ORDER BY experience_level;

-- 2. Fix common case variations (case sensitivity issues)
UPDATE profiles 
SET experience_level = 'Beginner'
WHERE role = 'cofounder' AND LOWER(experience_level) = 'beginner';

UPDATE profiles 
SET experience_level = 'Intermediate'
WHERE role = 'cofounder' AND LOWER(experience_level) = 'intermediate';

UPDATE profiles 
SET experience_level = 'Expert'
WHERE role = 'cofounder' AND LOWER(experience_level) = 'expert';

-- 3. Set any other invalid values to NULL (optional field)
UPDATE profiles 
SET experience_level = NULL
WHERE role = 'cofounder' 
AND experience_level IS NOT NULL 
AND experience_level NOT IN ('Beginner', 'Intermediate', 'Expert');

-- 4. Drop existing constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;

-- 5. Create new constraint
ALTER TABLE profiles 
ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IS NULL OR experience_level IN ('Beginner', 'Intermediate', 'Expert'));

-- 6. Verify success
SELECT 'Quick fix completed successfully!' as result;
SELECT experience_level, COUNT(*) as count
FROM profiles 
WHERE role = 'cofounder'
GROUP BY experience_level
ORDER BY experience_level;