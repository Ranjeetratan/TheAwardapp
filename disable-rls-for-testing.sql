-- Temporarily disable RLS for testing (ONLY for development)
-- Run this in your Supabase SQL editor if you're having permission issues

-- Disable RLS on profiles table for testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Disable RLS on advertisements table for testing  
ALTER TABLE advertisements DISABLE ROW LEVEL SECURITY;

-- Alternative: Create permissive policies instead of disabling RLS
-- (Uncomment these if you prefer to keep RLS enabled)

-- CREATE POLICY "Allow all operations on profiles" ON profiles
-- FOR ALL USING (true) WITH CHECK (true);

-- CREATE POLICY "Allow all operations on advertisements" ON advertisements  
-- FOR ALL USING (true) WITH CHECK (true);