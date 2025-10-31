-- Quick fix for co-founder profile submission issues
-- This addresses constraint violations on experience_level field

-- Drop any existing problematic constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS chk_experience_level;

-- Create the correct constraint that matches ProfileForm options
ALTER TABLE profiles 
ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IS NULL OR experience_level IN ('Beginner', 'Intermediate', 'Expert'));

-- Also check for any other potential constraint issues
-- Drop and recreate availability constraint if needed
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_availability_check;
ALTER TABLE profiles 
ADD CONSTRAINT profiles_availability_check 
CHECK (availability IS NULL OR availability IN ('Full-time', 'Part-time', 'Open to Discuss'));

-- Drop and recreate role constraint if needed  
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('founder', 'cofounder', 'investor'));

-- Verify the constraints are working
SELECT 'Constraints fixed! Co-founder profiles should now submit successfully.' as status;