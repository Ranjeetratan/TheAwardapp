-- APPROVE ALL PROFILES IN LIVE DATABASE
-- Run this in your Supabase SQL Editor to make all profiles visible

-- 1. First, let's see what we have
SELECT 'CURRENT PROFILE STATUS:' as info;
SELECT 
  role,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN approved = true THEN 1 END) as approved_profiles,
  COUNT(CASE WHEN approved = false OR approved IS NULL THEN 1 END) as pending_profiles
FROM profiles 
GROUP BY role
ORDER BY role;

-- 2. Show all profiles with their current approval status
SELECT 'ALL PROFILES IN DATABASE:' as info;
SELECT 
  id,
  full_name,
  role,
  approved,
  featured,
  created_at
FROM profiles 
ORDER BY created_at DESC;

-- 3. APPROVE ALL PROFILES (This is the main fix)
UPDATE profiles 
SET approved = true 
WHERE approved = false OR approved IS NULL;

-- 4. Set up auto-approval system if not already done
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on settings table
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for settings
DROP POLICY IF EXISTS "Allow all operations on admin_settings" ON admin_settings;
CREATE POLICY "Allow all operations on admin_settings" ON admin_settings
FOR ALL USING (true) WITH CHECK (true);

-- Set auto-approval to ON
INSERT INTO admin_settings (setting_key, setting_value) 
VALUES ('auto_approve_profiles', true)
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = true,
  updated_at = NOW();

-- 5. Verify the results
SELECT 'AFTER APPROVAL - PROFILE STATUS:' as info;
SELECT 
  role,
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN approved = true THEN 1 END) as approved_profiles,
  COUNT(CASE WHEN approved = false OR approved IS NULL THEN 1 END) as pending_profiles
FROM profiles 
GROUP BY role
ORDER BY role;

-- 6. Show all approved profiles that should now be visible
SELECT 'APPROVED PROFILES (SHOULD BE VISIBLE ON WEBSITE):' as info;
SELECT 
  id,
  full_name,
  role,
  approved,
  featured,
  created_at
FROM profiles 
WHERE approved = true
ORDER BY 
  featured DESC,
  CASE 
    WHEN role = 'founder' THEN 1
    WHEN role = 'cofounder' THEN 2
    WHEN role = 'investor' THEN 3
  END,
  created_at DESC;

-- 7. Final summary
SELECT 
  'SUCCESS! All profiles approved and should be visible on the website.' as result,
  COUNT(*) as total_approved_profiles
FROM profiles 
WHERE approved = true;