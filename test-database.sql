-- Test queries to check database structure and data

-- Check if profiles table exists and its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Check current profiles count
SELECT COUNT(*) as total_profiles FROM profiles;

-- Check profiles by approval status
SELECT approved, COUNT(*) as count FROM profiles GROUP BY approved;

-- Check recent profiles
SELECT id, full_name, email, approved, created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Check RLS policies on profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';