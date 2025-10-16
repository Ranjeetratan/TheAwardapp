-- Create the profiles table
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  headshot_url TEXT,
  location TEXT NOT NULL,
  linkedin_profile TEXT NOT NULL,
  website_portfolio TEXT,
  short_bio TEXT NOT NULL,
  availability TEXT NOT NULL CHECK (availability IN ('Full-time', 'Part-time', 'Open to Discuss')),
  timezone TEXT,
  looking_for TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('founder', 'cofounder')),
  
  -- Founder-specific fields
  startup_name TEXT,
  startup_stage TEXT CHECK (startup_stage IN ('Idea', 'MVP', 'Pre-Seed', 'Seed', 'Scaling')),
  industry TEXT,
  what_building TEXT,
  looking_for_cofounder TEXT,
  
  -- Cofounder-specific fields
  skills_expertise TEXT,
  experience_level TEXT CHECK (experience_level IN ('Beginner', 'Intermediate', 'Expert')),
  industry_interests TEXT,
  past_projects TEXT,
  why_join_startup TEXT,
  
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the headshots storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('headshots', 'headshots', true);

-- Create policy to allow public uploads to headshots bucket
CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'headshots');

-- Create policy to allow public access to headshots
CREATE POLICY "Allow public access" ON storage.objects FOR SELECT USING (bucket_id = 'headshots');

-- Create policy to allow public inserts to profiles table
CREATE POLICY "Allow public inserts" ON profiles FOR INSERT WITH CHECK (true);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;