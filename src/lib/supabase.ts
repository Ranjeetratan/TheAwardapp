import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase configuration error:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    timestamp: new Date().toISOString()
  })
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export type Profile = {
  id?: string
  user_id?: string
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
  role: 'founder' | 'cofounder' | 'investor'
  
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
  
  // Investor-specific fields
  investment_range?: string
  investment_stage?: string
  investment_focus?: string
  portfolio_companies?: string
  investment_criteria?: string
  
  approved: boolean
  featured: boolean
  created_at?: string
}

export type Advertisement = {
  id: string
  title: string
  description: string
  image_url?: string
  cta_text: string
  cta_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}