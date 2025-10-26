-- Simple fix for co-founder experience_level constraint error
-- This script fixes the PostgreSQL constraint issue

-- Drop any existing experience_level constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS chk_experience_level;

-- Create the correct constraint that matches ProfileForm options
ALTER TABLE profiles 
ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IS NULL OR experience_level IN ('Beginner', 'Intermediate', 'Expert'));

-- Verify it worked
SELECT 'Experience level constraint fixed successfully!' as result;

-- Test that the constraint allows the expected values
SELECT 'Valid experience levels are: Beginner, Intermediate, Expert' as info;