-- Additional Features Script for CofounderBase
-- Run this AFTER your existing setup to add new features
-- This script is safe to run on existing databases

-- STEP 1: Add new columns to existing profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS company_size TEXT,
ADD COLUMN IF NOT EXISTS funding_stage TEXT,
ADD COLUMN IF NOT EXISTS investment_range TEXT,
ADD COLUMN IF NOT EXISTS investment_stage TEXT,
ADD COLUMN IF NOT EXISTS investment_focus TEXT,
ADD COLUMN IF NOT EXISTS portfolio_companies TEXT,
ADD COLUMN IF NOT EXISTS investment_criteria TEXT;

-- STEP 2: Update existing constraints to include new options
-- Remove old constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_availability_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_startup_stage_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Clean existing data to match new formats
UPDATE profiles SET experience_level = 'Beginner (0-2 years)' WHERE experience_level = 'Beginner';
UPDATE profiles SET experience_level = 'Intermediate (3-5 years)' WHERE experience_level = 'Intermediate';
UPDATE profiles SET experience_level = 'Expert (10+ years)' WHERE experience_level = 'Expert';

-- Add updated constraints with new options
ALTER TABLE profiles ADD CONSTRAINT profiles_availability_check 
CHECK (availability IN ('Full-time', 'Part-time', 'Open to Discuss', 'Consulting', 'Equity Only', 'Sweat Equity', 'Paid Role'));

ALTER TABLE profiles ADD CONSTRAINT profiles_startup_stage_check 
CHECK (startup_stage IN ('Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Scaling', 'Product-Market Fit') OR startup_stage IS NULL);

ALTER TABLE profiles ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IN ('Beginner (0-2 years)', 'Intermediate (3-5 years)', 'Senior (6-10 years)', 'Expert (10+ years)', 'Serial Entrepreneur') OR experience_level IS NULL);

ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('founder', 'cofounder', 'investor'));

-- Add constraints for new columns
ALTER TABLE profiles ADD CONSTRAINT profiles_company_size_check 
CHECK (company_size IN ('Solo Founder', '2-3 People', '4-10 People', '11-50 People', '50+ People') OR company_size IS NULL);

ALTER TABLE profiles ADD CONSTRAINT profiles_funding_stage_check 
CHECK (funding_stage IN ('Bootstrapped', 'Pre-Revenue', 'Revenue Generating', 'Profitable', 'Seeking Investment', 'Recently Funded') OR funding_stage IS NULL);

ALTER TABLE profiles ADD CONSTRAINT profiles_investment_range_check 
CHECK (investment_range IN ('$1K-$10K', '$10K-$50K', '$50K-$100K', '$100K-$500K', '$500K-$1M', '$1M-$5M', '$5M+') OR investment_range IS NULL);

ALTER TABLE profiles ADD CONSTRAINT profiles_investment_stage_check 
CHECK (investment_stage IN ('Angel', 'Seed', 'Series A', 'Series B+', 'Strategic', 'Venture Debt', 'Syndicate', 'Family Office') OR investment_stage IS NULL);

-- STEP 3: Create advertisements table for admin-managed ads
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  cta_text TEXT NOT NULL DEFAULT 'Connect Now',
  cta_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 4: Create storage bucket for advertisement images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('advertisements', 'advertisements', true)
ON CONFLICT (id) DO NOTHING;

-- STEP 5: Add RLS policies for new features
-- Policies for profiles table (enhanced)
DROP POLICY IF EXISTS "Allow public read approved profiles" ON profiles;
CREATE POLICY "Allow public read approved profiles" ON profiles FOR SELECT USING (approved = true);

-- Policies for advertisements table
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read active ads" ON advertisements FOR SELECT USING (is_active = true);

-- Storage policies for advertisement images
CREATE POLICY "Allow public access to ads" ON storage.objects FOR SELECT USING (bucket_id = 'advertisements');

-- STEP 6: Add performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_approved ON profiles(approved);
CREATE INDEX IF NOT EXISTS idx_profiles_featured ON profiles(featured);
CREATE INDEX IF NOT EXISTS idx_profiles_industry ON profiles(industry);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_availability ON profiles(availability);
CREATE INDEX IF NOT EXISTS idx_profiles_startup_stage ON profiles(startup_stage);
CREATE INDEX IF NOT EXISTS idx_profiles_experience_level ON profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_investment_range ON profiles(investment_range);
CREATE INDEX IF NOT EXISTS idx_profiles_company_size ON profiles(company_size);
CREATE INDEX IF NOT EXISTS idx_profiles_funding_stage ON profiles(funding_stage);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- STEP 7: Create function and trigger for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_advertisements_updated_at ON advertisements;
CREATE TRIGGER update_advertisements_updated_at BEFORE UPDATE ON advertisements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- STEP 8: Update existing records with updated_at timestamp
UPDATE profiles SET updated_at = created_at WHERE updated_at IS NULL;

-- STEP 9: Insert sample advertisements
INSERT INTO advertisements (title, description, cta_text, cta_url) 
VALUES 
('Partner with CofounderBase', 'Looking to connect with top-tier founders and cofounders? Partner with us to reach the most ambitious entrepreneurs.', 'Partner Now', 'mailto:partnerships@cofounderbase.com'),
('Startup Resources', 'Access our curated collection of startup tools, templates, and resources to accelerate your journey.', 'Explore Resources', '#resources')
ON CONFLICT DO NOTHING;

-- STEP 10: Insert sample profiles to make the website live (optional - only if table is mostly empty)
INSERT INTO profiles (
  full_name, email, location, linkedin_profile, website_portfolio, short_bio, 
  availability, looking_for, role, startup_name, startup_stage, industry, 
  what_building, company_size, funding_stage, approved, featured
) 
SELECT * FROM (VALUES 
  ('Alex Chen', 'alex@techstartup.com', 'San Francisco, CA', 
   'https://linkedin.com/in/alexchen', 'https://alexchen.dev',
   'Serial entrepreneur with 2 successful exits. Building the future of AI-powered healthcare diagnostics. Looking for a technical co-founder with deep ML expertise.',
   'Full-time', 'Technical Co-founder', 'founder', 'HealthAI Labs', 'Pre-Seed', 'HealthTech',
   'AI-powered diagnostic platform for early disease detection', '2-3 People', 'Seeking Investment', true, true),
  
  ('Sarah Rodriguez', 'sarah@devexpert.io', 'New York, NY',
   'https://linkedin.com/in/sarahrodriguez', 'https://sarahdev.portfolio.com',
   'Full-stack engineer with 8 years at Google and Meta. Expert in React, Node.js, and scalable systems. Passionate about fintech and looking for equity-based startup opportunity.',
   'Full-time', 'Startup Opportunity', 'cofounder', null, null, null, null, null, null, true, true),
  
  ('Michael Park', 'michael@venturecap.com', 'Austin, TX',
   'https://linkedin.com/in/michaelpark', 'https://venturecap.com/team/michael',
   'Angel investor and former startup founder. Invested in 50+ early-stage companies with 12 successful exits. Focus on B2B SaaS and developer tools.',
   'Part-time', 'Investment Opportunities', 'investor', null, null, null, null, null, null, true, false),
  
  ('Emma Thompson', 'emma@climatech.org', 'Remote',
   'https://linkedin.com/in/emmathompson', 'https://emmathompson.com',
   'Climate tech entrepreneur building carbon tracking solutions for enterprises. Former McKinsey consultant with deep sustainability expertise.',
   'Full-time', 'Technical Co-founder', 'founder', 'CarbonTrack', 'MVP', 'Climate Tech',
   'Enterprise carbon footprint tracking and reduction platform', 'Solo Founder', 'Pre-Revenue', true, false),
  
  ('David Kim', 'david@mobiledev.pro', 'Los Angeles, CA',
   'https://linkedin.com/in/davidkim', 'https://davidkim.dev',
   'Mobile development specialist with 6 years experience. Built 10+ iOS/Android apps with 1M+ downloads. Expert in React Native, Flutter, and native development.',
   'Part-time', 'Startup Opportunity', 'cofounder', null, null, null, null, null, null, true, false)
) AS sample_data
WHERE (SELECT COUNT(*) FROM profiles) < 5; -- Only insert if there are fewer than 5 profiles

-- STEP 11: Verification queries (optional - comment out if not needed)
/*
-- Verify the setup worked
SELECT 
  'Setup Verification' as check_type,
  COUNT(*) as total_profiles,
  COUNT(*) FILTER (WHERE featured = true) as featured_profiles,
  COUNT(*) FILTER (WHERE role = 'founder') as founders,
  COUNT(*) FILTER (WHERE role = 'cofounder') as cofounders,
  COUNT(*) FILTER (WHERE role = 'investor') as investors,
  COUNT(*) FILTER (WHERE company_size IS NOT NULL) as profiles_with_company_size,
  COUNT(*) FILTER (WHERE updated_at IS NOT NULL) as profiles_with_updated_at
FROM profiles;

-- Check advertisements
SELECT COUNT(*) as total_ads, COUNT(*) FILTER (WHERE is_active = true) as active_ads FROM advertisements;
*/

-- SUCCESS MESSAGE
SELECT 'CofounderBase additional features installed successfully!' as status,
       'Your database now supports investors, enhanced filtering, featured profiles, and more!' as message;