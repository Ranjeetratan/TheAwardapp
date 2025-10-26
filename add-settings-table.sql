-- Add settings table for admin preferences
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default auto-approval setting (enabled by default)
INSERT INTO admin_settings (setting_key, setting_value) 
VALUES ('auto_approve_profiles', true)
ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS on settings table
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is admin-only)
CREATE POLICY "Allow all operations on admin_settings" ON admin_settings
FOR ALL USING (true) WITH CHECK (true);

-- Approve all existing profiles immediately
UPDATE profiles 
SET approved = true 
WHERE approved = false OR approved IS NULL;

-- Verify the setup
SELECT 'Settings table created and auto-approval enabled!' as status;
SELECT * FROM admin_settings;
SELECT 
  COUNT(*) as total_profiles,
  COUNT(CASE WHEN approved = true THEN 1 END) as approved_profiles
FROM profiles;