-- Create advertisements table if it doesn't exist
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  cta_text TEXT NOT NULL,
  cta_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for advertisements
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active advertisements
CREATE POLICY "Public can view active advertisements" ON advertisements
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to manage advertisements (for admin panel)
CREATE POLICY "Authenticated users can manage advertisements" ON advertisements
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample advertisement
INSERT INTO advertisements (title, description, cta_text, cta_url, is_active) 
VALUES (
  'Looking to build your MVP?',
  '$1000 for the planning, Miro Board and the MVP. Get your startup idea validated and built by experts.',
  'Get Started',
  'mailto:ranjit.kumar.ds@gmail.com?subject=MVP Development Inquiry',
  true
) ON CONFLICT DO NOTHING;