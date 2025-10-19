-- Approve all existing profiles to make them live
-- Run this in your Supabase SQL Editor

-- First, let's see what we have
SELECT 
  'Current Profile Status' as check_type,
  COUNT(*) as total_profiles,
  COUNT(*) FILTER (WHERE approved = true) as approved_profiles,
  COUNT(*) FILTER (WHERE approved = false) as pending_profiles,
  COUNT(*) FILTER (WHERE role = 'founder') as founders,
  COUNT(*) FILTER (WHERE role = 'cofounder') as cofounders
FROM profiles;

-- Approve all existing profiles
UPDATE profiles SET approved = true WHERE approved = false;

-- Also set some profiles as featured for variety
UPDATE profiles SET featured = true 
WHERE id IN (
  SELECT id FROM profiles 
  WHERE approved = true 
  ORDER BY created_at DESC 
  LIMIT 2
);

-- Verify the update
SELECT 
  'After Approval' as check_type,
  COUNT(*) as total_profiles,
  COUNT(*) FILTER (WHERE approved = true) as approved_profiles,
  COUNT(*) FILTER (WHERE featured = true) as featured_profiles,
  COUNT(*) FILTER (WHERE role = 'founder') as founders,
  COUNT(*) FILTER (WHERE role = 'cofounder') as cofounders
FROM profiles;

-- Show the approved profiles
SELECT 
  full_name,
  role,
  location,
  startup_name,
  industry,
  approved,
  featured,
  created_at
FROM profiles 
WHERE approved = true
ORDER BY featured DESC, created_at DESC;