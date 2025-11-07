-- Supabase Authentication Setup for CofounderBase
-- Run this in your Supabase SQL Editor

-- Step 1: Enable Email Authentication
-- Go to Authentication > Providers in Supabase Dashboard
-- Make sure Email provider is enabled

-- Step 2: Update profiles table to link with auth users
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Step 3: Create a function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be called after a user signs up
  -- We'll create the profile in the app instead
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Create trigger for new user signup (optional)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Update RLS policies for profiles table
-- Drop existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved profiles
CREATE POLICY "Anyone can view approved profiles"
ON profiles FOR SELECT
USING (approved = true);

-- Policy: Authenticated users can view their own profile (even if not approved)
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Authenticated users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Admins can view all profiles (you'll need to set up admin role)
-- For now, we'll handle admin access through the admin panel

-- Step 6: Create a user_profiles view for easier querying
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  p.*,
  u.email as auth_email,
  u.created_at as user_created_at
FROM profiles p
LEFT JOIN auth.users u ON p.user_id = u.id;

-- Step 7: Grant necessary permissions
GRANT SELECT ON user_profiles TO authenticated;
GRANT SELECT ON user_profiles TO anon;

-- Verification queries
-- Check if user_id column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'user_id';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';