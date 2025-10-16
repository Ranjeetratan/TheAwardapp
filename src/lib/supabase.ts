import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Profile = {
  id?: string
  full_name: string
  email: string
  headshot_url?: string
  location: string
  linkedin_profile: string
  website_portfolio?: string
  short_bio: string
  availability: string
  timezone?: string
  looking_for: string
  role: 'founder' | 'cofounder'
  
  // Founder-specific fields
  startup_name?: string
  startup_stage?: string
  industry?: string
  what_building?: string
  looking_for_cofounder?: string
  
  // Cofounder-specific fields
  skills_expertise?: string
  experience_level?: string
  industry_interests?: string
  past_projects?: string
  why_join_startup?: string
  
  approved: boolean
  created_at?: string
}