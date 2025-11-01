-- IMMEDIATE FIX - Run this right now in Supabase SQL Editor

-- Drop the problematic constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;

-- Create the correct constraint that matches ProfileForm
ALTER TABLE profiles ADD CONSTRAINT profiles_experience_level_check CHECK (experience_level IS NULL OR experience_level IN ('Beginner', 'Intermediate', 'Expert'));