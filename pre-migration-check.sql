-- Pre-migration check script
-- Run this BEFORE running the migration to see what data might cause issues

-- Check current data that might conflict with new constraints
SELECT 'Current Data Analysis' as check_type;

-- Check experience_level values
SELECT 
  'experience_level' as field,
  experience_level as current_value,
  COUNT(*) as count,
  CASE 
    WHEN LOWER(TRIM(experience_level)) = 'beginner' THEN 'Will update to: Beginner (0-2 years)'
    WHEN LOWER(TRIM(experience_level)) = 'intermediate' THEN 'Will update to: Intermediate (3-5 years)'
    WHEN LOWER(TRIM(experience_level)) = 'expert' THEN 'Will update to: Expert (10+ years)'
    WHEN LOWER(TRIM(experience_level)) = 'senior' THEN 'Will update to: Senior (6-10 years)'
    WHEN experience_level IN ('Beginner (0-2 years)', 'Intermediate (3-5 years)', 'Senior (6-10 years)', 'Expert (10+ years)', 'Serial Entrepreneur') THEN 'Already valid'
    WHEN experience_level IS NULL THEN 'NULL - OK'
    ELSE 'NEEDS MANUAL UPDATE'
  END as migration_action
FROM profiles 
WHERE experience_level IS NOT NULL
GROUP BY experience_level
ORDER BY count DESC;

-- Check availability values
SELECT 
  'availability' as field,
  availability as current_value,
  COUNT(*) as count,
  CASE 
    WHEN availability IN ('Full-time', 'Part-time', 'Open to Discuss', 'Consulting', 'Equity Only', 'Sweat Equity', 'Paid Role') THEN 'Already valid'
    WHEN availability IS NULL THEN 'NULL - OK'
    ELSE 'Will update to: Full-time'
  END as migration_action
FROM profiles 
WHERE availability IS NOT NULL
GROUP BY availability
ORDER BY count DESC;

-- Check startup_stage values
SELECT 
  'startup_stage' as field,
  startup_stage as current_value,
  COUNT(*) as count,
  CASE 
    WHEN startup_stage IN ('Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Scaling', 'Product-Market Fit') THEN 'Already valid'
    WHEN startup_stage IS NULL THEN 'NULL - OK'
    ELSE 'Will update to: Pre-Seed'
  END as migration_action
FROM profiles 
WHERE startup_stage IS NOT NULL
GROUP BY startup_stage
ORDER BY count DESC;

-- Check role values
SELECT 
  'role' as field,
  role as current_value,
  COUNT(*) as count,
  CASE 
    WHEN role IN ('founder', 'cofounder', 'investor') THEN 'Already valid'
    WHEN role IS NULL THEN 'NULL - NEEDS MANUAL FIX (required field)'
    ELSE 'NEEDS MANUAL UPDATE'
  END as migration_action
FROM profiles 
GROUP BY role
ORDER BY count DESC;

-- Summary
SELECT 
  'SUMMARY' as check_type,
  COUNT(*) as total_profiles,
  COUNT(*) FILTER (WHERE experience_level NOT IN ('Beginner (0-2 years)', 'Intermediate (3-5 years)', 'Senior (6-10 years)', 'Expert (10+ years)', 'Serial Entrepreneur') AND experience_level IS NOT NULL) as experience_level_issues,
  COUNT(*) FILTER (WHERE availability NOT IN ('Full-time', 'Part-time', 'Open to Discuss', 'Consulting', 'Equity Only', 'Sweat Equity', 'Paid Role') AND availability IS NOT NULL) as availability_issues,
  COUNT(*) FILTER (WHERE startup_stage NOT IN ('Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Scaling', 'Product-Market Fit') AND startup_stage IS NOT NULL) as startup_stage_issues,
  COUNT(*) FILTER (WHERE role NOT IN ('founder', 'cofounder', 'investor') OR role IS NULL) as role_issues
FROM profiles;

-- Show problematic rows that need manual attention
SELECT 
  'PROBLEMATIC ROWS' as check_type,
  id,
  full_name,
  email,
  role,
  experience_level,
  availability,
  startup_stage
FROM profiles 
WHERE 
  (experience_level NOT IN ('Beginner (0-2 years)', 'Intermediate (3-5 years)', 'Senior (6-10 years)', 'Expert (10+ years)', 'Serial Entrepreneur') AND experience_level IS NOT NULL)
  OR (availability NOT IN ('Full-time', 'Part-time', 'Open to Discuss', 'Consulting', 'Equity Only', 'Sweat Equity', 'Paid Role') AND availability IS NOT NULL)
  OR (startup_stage NOT IN ('Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Scaling', 'Product-Market Fit') AND startup_stage IS NOT NULL)
  OR (role NOT IN ('founder', 'cofounder', 'investor') OR role IS NULL)
LIMIT 10;