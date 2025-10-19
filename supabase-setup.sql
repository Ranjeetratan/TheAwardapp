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
  availability TEXT NOT NULL CHECK (availability IN ('Full-time', 'Part-time', 'Open to Discuss', 'Consulting', 'Equity Only', 'Sweat Equity', 'Paid Role')),
  timezone TEXT,
  looking_for TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('founder', 'cofounder', 'investor')),
  
  -- Founder-specific fields
  startup_name TEXT,
  startup_stage TEXT CHECK (startup_stage IN ('Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Scaling', 'Product-Market Fit')),
  industry TEXT,
  what_building TEXT,
  looking_for_cofounder TEXT,
  company_size TEXT CHECK (company_size IN ('Solo Founder', '2-3 People', '4-10 People', '11-50 People', '50+ People')),
  funding_stage TEXT CHECK (funding_stage IN ('Bootstrapped', 'Pre-Revenue', 'Revenue Generating', 'Profitable', 'Seeking Investment', 'Recently Funded')),
  
  -- Cofounder-specific fields
  skills_expertise TEXT,
  experience_level TEXT CHECK (experience_level IN ('Beginner (0-2 years)', 'Intermediate (3-5 years)', 'Senior (6-10 years)', 'Expert (10+ years)', 'Serial Entrepreneur')),
  industry_interests TEXT,
  past_projects TEXT,
  why_join_startup TEXT,
  
  -- Investor-specific fields
  investment_range TEXT CHECK (investment_range IN ('$1K-$10K', '$10K-$50K', '$50K-$100K', '$100K-$500K', '$500K-$1M', '$1M-$5M', '$5M+')),
  investment_stage TEXT CHECK (investment_stage IN ('Angel', 'Seed', 'Series A', 'Series B+', 'Strategic', 'Venture Debt', 'Syndicate', 'Family Office')),
  investment_focus TEXT,
  portfolio_companies TEXT,
  investment_criteria TEXT,
  
  approved BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create advertisements table for admin-managed ads
CREATE TABLE advertisements (
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

-- Insert sample advertisements
INSERT INTO advertisements (title, description, image_url, cta_text, cta_url) VALUES 
('Partner with CofounderBase', 'Looking to connect with top-tier founders and cofounders? Partner with us to reach the most ambitious entrepreneurs.', null, 'Partner Now', 'mailto:partnerships@cofounderbase.com'),
('Startup Resources', 'Access our curated collection of startup tools, templates, and resources to accelerate your journey.', null, 'Explore Resources', '#resources');

-- Insert sample profiles to make the website live
INSERT INTO profiles (
  full_name, email, location, linkedin_profile, website_portfolio, short_bio, 
  availability, looking_for, role, startup_name, startup_stage, industry, 
  what_building, company_size, funding_stage, approved, featured
) VALUES 
(
  'Alex Chen', 'alex@techstartup.com', 'San Francisco, CA', 
  'https://linkedin.com/in/alexchen', 'https://alexchen.dev',
  'Serial entrepreneur with 2 successful exits. Building the future of AI-powered healthcare diagnostics. Looking for a technical co-founder with deep ML expertise.',
  'Full-time', 'Technical Co-founder', 'founder', 'HealthAI Labs', 'Pre-Seed', 'HealthTech',
  'AI-powered diagnostic platform for early disease detection', '2-3 People', 'Seeking Investment', true, true
),
(
  'Sarah Rodriguez', 'sarah@devexpert.io', 'New York, NY',
  'https://linkedin.com/in/sarahrodriguez', 'https://sarahdev.portfolio.com',
  'Full-stack engineer with 8 years at Google and Meta. Expert in React, Node.js, and scalable systems. Passionate about fintech and looking for equity-based startup opportunity.',
  'Full-time', 'Startup Opportunity', 'cofounder', null, null, null, null, null, null,
  'React, Node.js, Python, AWS, System Design', 'Expert (10+ years)', 'FinTech, SaaS', 
  'Led engineering teams at scale, built payment systems', 'Want to join early-stage startup as technical co-founder', true, true
),
(
  'Michael Park', 'michael@venturecap.com', 'Austin, TX',
  'https://linkedin.com/in/michaelpark', 'https://venturecap.com/team/michael',
  'Angel investor and former startup founder. Invested in 50+ early-stage companies with 12 successful exits. Focus on B2B SaaS and developer tools.',
  'Part-time', 'Investment Opportunities', 'investor', null, null, null, null, null, null,
  null, null, null, null, null, '$50K-$100K', 'Angel', 'B2B SaaS, Developer Tools, AI/ML',
  'Slack, Notion, Figma, Linear, 40+ others', 'Early traction, strong team, clear market need', true, false
),
(
  'Emma Thompson', 'emma@climatech.org', 'Remote',
  'https://linkedin.com/in/emmathompson', 'https://emmathompson.com',
  'Climate tech entrepreneur building carbon tracking solutions for enterprises. Former McKinsey consultant with deep sustainability expertise.',
  'Full-time', 'Technical Co-founder', 'founder', 'CarbonTrack', 'MVP', 'Climate Tech',
  'Enterprise carbon footprint tracking and reduction platform', 'Solo Founder', 'Pre-Revenue', true, false
),
(
  'David Kim', 'david@mobiledev.pro', 'Los Angeles, CA',
  'https://linkedin.com/in/davidkim', 'https://davidkim.dev',
  'Mobile development specialist with 6 years experience. Built 10+ iOS/Android apps with 1M+ downloads. Expert in React Native, Flutter, and native development.',
  'Part-time', 'Startup Opportunity', 'cofounder', null, null, null, null, null, null,
  'React Native, Flutter, iOS, Android, Firebase', 'Senior (6-10 years)', 'Mobile Apps, Consumer Tech',
  'Dating app (500K users), Fitness app (1M downloads), E-commerce platform', 'Looking for equity opportunity in consumer mobile space', true, false
),
(
  'Lisa Wang', 'lisa@edtechventures.com', 'Boston, MA',
  'https://linkedin.com/in/lisawang', null,
  'EdTech founder revolutionizing online learning with AI tutoring. Former teacher turned entrepreneur with deep understanding of education challenges.',
  'Full-time', 'Technical Co-founder', 'founder', 'AI Tutor Pro', 'Seed', 'EdTech',
  'Personalized AI tutoring platform for K-12 students', '4-10 People', 'Recently Funded', true, true
),
(
  'James Wilson', 'james@blockchaindev.io', 'Miami, FL',
  'https://linkedin.com/in/jameswilson', 'https://jameswilson.crypto',
  'Blockchain engineer with expertise in DeFi and Web3. Built smart contracts handling $100M+ in transactions. Looking for crypto/Web3 startup opportunities.',
  'Full-time', 'Startup Opportunity', 'cofounder', null, null, null, null, null, null,
  'Solidity, Web3, DeFi, Smart Contracts, Rust', 'Expert (10+ years)', 'Crypto/Web3, FinTech',
  'DeFi protocol (TVL $50M), NFT marketplace, DAO governance system', 'Seeking founding role in innovative Web3 project', true, false
),
(
  'Rachel Green', 'rachel@designstudio.co', 'Seattle, WA',
  'https://linkedin.com/in/rachelgreen', 'https://rachelgreen.design',
  'Product designer with 7 years at top startups. Led design for 3 apps that reached unicorn status. Expert in user research, prototyping, and design systems.',
  'Open to Discuss', 'Startup Opportunity', 'cofounder', null, null, null, null, null, null,
  'Product Design, UI/UX, Figma, User Research, Design Systems', 'Senior (6-10 years)', 'SaaS, Consumer Apps',
  'Designed for Airbnb, Stripe, and 2 unicorn startups', 'Looking for design co-founder role with equity', true, false
),
(
  'Robert Chen', 'robert@seedfund.vc', 'San Francisco, CA',
  'https://linkedin.com/in/robertchen', 'https://seedfund.vc',
  'Seed stage VC partner at top-tier fund. Former founder with successful exit. Invested in 100+ startups including 5 unicorns. Focus on enterprise software.',
  'Open to Discuss', 'Investment Opportunities', 'investor', null, null, null, null, null, null,
  null, null, null, null, null, '$500K-$1M', 'Seed', 'Enterprise Software, B2B SaaS, Developer Tools',
  'Slack, Zoom, Databricks, Snowflake, 95+ others', 'Strong founding team, large market, early product-market fit signals', true, true
),
(
  'Maria Garcia', 'maria@nocodestudio.com', 'Denver, CO',
  'https://linkedin.com/in/mariagarcia', 'https://mariagarcia.bubble.io',
  'No-code expert and automation specialist. Built 50+ applications using Bubble, Webflow, and Zapier. Helping non-technical founders build MVPs quickly.',
  'Consulting', 'MVP Development', 'cofounder', null, null, null, null, null, null,
  'Bubble, Webflow, Zapier, Airtable, No-Code Development', 'Intermediate (3-5 years)', 'No-Code, SaaS',
  'Built marketplace app (10K users), CRM system, booking platform', 'Available for no-code MVP development and technical partnerships', true, false
);

-- Create the headshots storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('headshots', 'headshots', true);

-- Create the ads storage bucket for advertisement images
INSERT INTO storage.buckets (id, name, public) VALUES ('advertisements', 'advertisements', true);

-- Create policies for profiles table
CREATE POLICY "Allow public read approved profiles" ON profiles FOR SELECT USING (approved = true);
CREATE POLICY "Allow public inserts" ON profiles FOR INSERT WITH CHECK (true);

-- Create policies for advertisements table
CREATE POLICY "Allow public read active ads" ON advertisements FOR SELECT USING (is_active = true);

-- Create policy to allow public uploads to headshots bucket
CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'headshots');

-- Create policy to allow public access to headshots
CREATE POLICY "Allow public access" ON storage.objects FOR SELECT USING (bucket_id = 'headshots');

-- Create policy to allow public access to advertisement images
CREATE POLICY "Allow public access to ads" ON storage.objects FOR SELECT USING (bucket_id = 'advertisements');

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_approved ON profiles(approved);
CREATE INDEX idx_profiles_featured ON profiles(featured);
CREATE INDEX idx_profiles_industry ON profiles(industry);
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_profiles_availability ON profiles(availability);
CREATE INDEX idx_profiles_startup_stage ON profiles(startup_stage);
CREATE INDEX idx_profiles_experience_level ON profiles(experience_level);
CREATE INDEX idx_profiles_investment_range ON profiles(investment_range);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();