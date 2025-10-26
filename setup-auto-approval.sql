-- Complete setup for auto-approval system
-- Run this in your Supabase SQL editor

-- 1. Create admin_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS on settings table
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- 3. Create policy to allow all operations (since this is admin-only)
DROP POLICY IF EXISTS "Allow all operations on admin_settings" ON admin_settings;
CREATE POLICY "Allow all operations on admin_settings" ON admin_settings
FOR ALL USING (true) WITH CHECK (true);

-- 4. Insert/update auto-approval setting (enabled by default)
INSERT INTO admin_settings (setting_key, setting_value) 
VALUES ('auto_approve_profiles', true)
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = true,
  updated_at = NOW();

-- 5. Approve ALL existing profiles immediately
UPDATE profiles 
SET approved = true 
WHERE approved = false OR approved IS NULL;

-- 6. Verify the setup
SELECT 'Auto-approval system setup completed!' as status;

SELECT 'Current Settings:' as info;
SELECT * FROM admin_settings;

SELECT 'Profile Status After Setup:' as info;
SELECT 
  role,
  COUNT(*) as total,
  COUNT(CASE WHEN approved = true THEN 1 END) as approved,
  COUNT(CASE WHEN approved = false OR approved IS NULL THEN 1 END) as pending
FROM profiles 
GROUP BY role
ORDER BY role;

SELECT 'All profiles should now be approved and visible!' as result;