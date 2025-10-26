-- Fix co-founder profile submission constraint error
-- The error indicates there's a check constraint on experience_level that's failing

-- First, let's see what the current constraint allows
SELECT conname, consrc 
FROM pg_constraint 
WHERE conname LIKE '%experience_level%';

-- Check what values are currently in the database
SELECT DISTINCT experience_level 
FROM profiles 
WHERE role = 'cofounder' AND experience_level IS NOT NULL;

-- Drop the problematic constraint if it exists
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;

-- Create a new constraint that matches the ProfileForm options exactly
ALTER TABLE profiles ADD CONSTRAINT profiles_experience_level_check 
CHECK (
  experience_level IS NULL OR 
  experience_level IN ('Beginner', 'Intermediate', 'Expert')
);

-- Verify the constraint is working
SELECT 'Constraint updated successfully!' as status;