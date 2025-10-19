-- Migration script for existing CofounderBase databases
-- Run this if you already have a profiles table and need to add new fields

-- STEP 1: Add new columns to existing profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS company_size TEXT,
ADD COLUMN IF NOT EXISTS funding_stage TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- STEP 2: Remove all existing constraints first to avoid conflicts
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_availability_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_startup_stage_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_investment_range_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_investment_stage_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_company_size_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_funding_stage_check;

-- STEP 3: Clean up existing data to match new constraints
-- Clean experience_level values
UPDATE profiles SET experience_level = TRIM(experience_level) WHERE experience_level IS NOT NULL;
UPDATE profiles SET experience_level = 'Beginner (0-2 years)' WHERE LOWER(TRIM(experience_level)) = 'beginner';
UPDATE profiles SET experience_level = 'Intermediate (3-5 years)' WHERE LOWER(TRIM(experience_level)) = 'intermediate';
UPDATE profiles SET experience_level = 'Expert (10+ years)' WHERE LOWER(TRIM(experience_level)) = 'expert';
UPDATE profiles SET experience_level = 'Senior (6-10 years)' WHERE LOWER(TRIM(experience_level)) = 'senior';

-- Clean availability values
UPDATE profiles SET availability = TRIM(availability) WHERE availability IS NOT NULL;
UPDATE profiles SET availability = 'Full-time' WHERE LOWER(TRIM(availability)) = 'full-time';
UPDATE profiles SET availability = 'Part-time' WHERE LOWER(TRIM(availability)) = 'part-time';
UPDATE profiles SET availability = 'Open to Discuss' WHERE LOWER(TRIM(availability)) IN ('open to discuss', 'open');

-- Clean startup_stage values
UPDATE profiles SET startup_stage = TRIM(startup_stage) WHERE startup_stage IS NOT NULL;
UPDATE profiles SET startup_stage = 'Pre-Seed' WHERE LOWER(TRIM(startup_stage)) IN ('pre-seed', 'preseed', 'early');
UPDATE profiles SET startup_stage = 'Series A' WHERE LOWER(TRIM(startup_stage)) IN ('series a', 'series-a', 'seriesa');
UPDATE profiles SET startup_stage = 'Series B+' WHERE LOWER(TRIM(startup_stage)) IN ('series b', 'series-b', 'seriesb', 'series b+', 'growth');

-- Clean role values
UPDATE profiles SET role = TRIM(LOWER(role)) WHERE role IS NOT NULL;

-- STEP 4: Add new constraints (all allow NULL values for optional fields)
-- Availability constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_availability_check 
CHECK (availability IN ('Full-time', 'Part-time', 'Open to Discuss', 'Consulting', 'Equity Only', 'Sweat Equity', 'Paid Role') OR availability IS NULL);

-- Startup stage constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_startup_stage_check 
CHECK (startup_stage IN ('Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Scaling', 'Product-Market Fit') OR startup_stage IS NULL);

-- Experience level constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IN ('Beginner (0-2 years)', 'Intermediate (3-5 years)', 'Senior (6-10 years)', 'Expert (10+ years)', 'Serial Entrepreneur') OR experience_level IS NULL);

-- Role constraint (should not be NULL for required field)
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('founder', 'cofounder', 'investor'));

-- Add new check constraints for new columns
ALTER TABLE profiles ADD CONSTRAINT profiles_company_size_check 
CHECK (company_size IN ('Solo Founder', '2-3 People', '4-10 People', '11-50 People', '50+ People') OR company_size IS NULL);

ALTER TABLE profiles ADD CONSTRAINT profiles_funding_stage_check 
CHECK (funding_stage IN ('Bootstrapped', 'Pre-Revenue', 'Revenue Generating', 'Profitable', 'Seeking Investment', 'Recently Funded') OR funding_stage IS NULL);

-- Update investment_range check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_investment_range_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_investment_range_check 
CHECK (investment_range IN ('$1K-$10K', '$10K-$50K', '$50K-$100K', '$100K-$500K', '$500K-$1M', '$1M-$5M', '$5M+') OR investment_range IS NULL);

-- Update investment_stage check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_investment_stage_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_investment_stage_check 
CHECK (investment_stage IN ('Angel', 'Seed', 'Series A', 'Series B+', 'Strategic', 'Venture Debt', 'Syndicate', 'Family Office') OR investment_stage IS NULL);

-- Add new indexes
CREATE INDEX IF NOT EXISTS idx_profiles_availability ON profiles(availability);
CREATE INDEX IF NOT EXISTS idx_profiles_startup_stage ON profiles(startup_stage);
CREATE INDEX IF NOT EXISTS idx_profiles_experience_level ON profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_investment_range ON profiles(investment_range);
CREATE INDEX IF NOT EXISTS idx_profiles_company_size ON profiles(company_size);
CREATE INDEX IF NOT EXISTS idx_profiles_funding_stage ON profiles(funding_stage);

-- Create or replace the update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update existing records to have updated_at = created_at
UPDATE profiles SET updated_at = created_at WHERE updated_at IS NULL;

-- Insert sample profiles if the table is empty (optional - remove if you have existing data)
INSERT INTO profiles (
  full_name, email, location, linkedin_profile, website_portfolio, short_bio, 
  availability, looking_for, role, startup_name, startup_stage, industry, 
  what_building, company_size, funding_stage, approved, featured
) 
SELECT * FROM (VALUES 
  ('Alex Chen', 'alex@techstartup.com', 'San Francisco, CA', 
   'https://linkedin.com/in/alexchen', 'https://alexchen.dev',
   'Serial entrepreneur with 2 successful exits. Building AI-powered healthcare diagnostics.',
   'Full-time', 'Technical Co-founder', 'founder', 'HealthAI Labs', 'Pre-Seed', 'HealthTech',
   'AI-powered diagnostic platform', '2-3 People', 'Seeking Investment', true, true),
  ('Sarah Rodriguez', 'sarah@devexpert.io', 'New York, NY',
   'https://linkedin.com/in/sarahrodriguez', 'https://sarahdev.portfolio.com',
   'Full-stack engineer with 8 years at Google and Meta. Expert in React, Node.js.',
   'Full-time', 'Startup Opportunity', 'cofounder', null, null, null, null, null, null, true, true)
) AS sample_data
WHERE NOT EXISTS (SELECT 1 FROM profiles LIMIT 1);