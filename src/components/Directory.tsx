import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProfileCard } from './ProfileCard'
import { AdCard } from './AdCard'
import { ProfileModal } from './ProfileModal'
import { supabase } from '../lib/supabase'
import type { Profile, Advertisement } from '../lib/supabase'
import { Loader2 } from 'lucide-react'

interface DirectoryProps {
  activeTab: 'founders' | 'cofounders' | 'investors' | 'all'
  searchQuery: string
  filters: {
    location: string[]
    industry: string[]
    availability: string[]
    stage: string[]
    experience: string[]
    investmentRange: string[]
    investmentType: string[]
  }
  onViewFullProfile?: (profile: Profile) => void
}

export function Directory({ activeTab, searchQuery, filters, onViewFullProfile }: DirectoryProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchProfiles()
    fetchAdvertisements()
  }, [activeTab])

  // Retry fetching if no profiles found (in case of temporary network issues)
  useEffect(() => {
    if (!loading && profiles.length === 0) {
      console.log('No profiles found, retrying fetch in 2 seconds...')
      const retryTimer = setTimeout(() => {
        fetchProfiles()
      }, 2000)
      
      return () => clearTimeout(retryTimer)
    }
  }, [loading, profiles.length])

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      console.log('Fetching profiles for activeTab:', activeTab)
      
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('approved', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      // Filter by role if specific tab is selected
      if (activeTab !== 'all') {
        const roleToQuery = activeTab.slice(0, -1) // Remove 's' from 'founders'/'cofounders'/'investors'
        query = query.eq('role', roleToQuery)
      }

      const { data, error } = await query

      if (error) {
        console.error('Supabase error:', error)
        console.error('Error details:', error.message, error.details, error.hint)
        setProfiles([])
      } else {
        console.log('Fetched profiles:', data?.length || 0, 'profiles')
        console.log('Profile data:', data)
        setProfiles(data || [])
      }
    } catch (error) {
      console.error('Error fetching profiles:', error)
      setProfiles([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAdvertisements = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase ads error:', error)
        // Add mock ads if there's an error
        const mockAds: Advertisement[] = [
          {
            id: 'mock-ad-1',
            title: 'Looking to build your MVP?',
            description: '$1000 for the planning, Miro Board and the MVP. Get your startup idea validated and built by experts.',
            cta_text: 'Get Started',
            cta_url: 'mailto:contact@cofounderbase.com?subject=MVP Development Inquiry',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
        setAdvertisements(mockAds)
      } else {
        console.log('Fetched advertisements:', data?.length || 0, 'ads')
        setAdvertisements(data || [])
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error)
      setAdvertisements([])
    }
  }

  const filteredProfiles = profiles.filter(profile => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = 
        profile.full_name.toLowerCase().includes(searchLower) ||
        profile.short_bio.toLowerCase().includes(searchLower) ||
        profile.location.toLowerCase().includes(searchLower) ||
        (profile.startup_name && profile.startup_name.toLowerCase().includes(searchLower)) ||
        (profile.industry && profile.industry.toLowerCase().includes(searchLower)) ||
        (profile.skills_expertise && profile.skills_expertise.toLowerCase().includes(searchLower))
      
      if (!matchesSearch) return false
    }

    // Location filter
    if (filters.location.length > 0) {
      const matchesLocation = filters.location.some(loc => 
        profile.location.toLowerCase().includes(loc.toLowerCase()) ||
        (loc === 'Remote' && profile.location.toLowerCase().includes('remote'))
      )
      if (!matchesLocation) return false
    }

    // Industry filter
    if (filters.industry.length > 0 && profile.industry) {
      const matchesIndustry = filters.industry.some(ind => 
        profile.industry!.toLowerCase().includes(ind.toLowerCase())
      )
      if (!matchesIndustry) return false
    }

    // Availability filter
    if (filters.availability.length > 0) {
      if (!filters.availability.includes(profile.availability)) return false
    }

    // Stage filter (for founders)
    if (filters.stage.length > 0 && profile.role === 'founder' && profile.startup_stage) {
      if (!filters.stage.includes(profile.startup_stage)) return false
    }

    // Experience filter (for cofounders)
    if (filters.experience.length > 0 && profile.role === 'cofounder' && profile.experience_level) {
      if (!filters.experience.includes(profile.experience_level)) return false
    }

    return true
  })

  const handleProfileClick = (profile: Profile) => {
    setSelectedProfile(profile)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProfile(null)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
        <p className="text-muted-foreground">Loading {activeTab}...</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                🔍
              </motion.div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No {activeTab} found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || Object.values(filters).some(f => f.length > 0) 
                ? `Try adjusting your search or filters to find more ${activeTab}.`
                : `Be the first to join our ${activeTab} directory!`
              }
            </p>
            <button
              onClick={() => {
                // Scroll to submit profile section or trigger form
                const event = new CustomEvent('openProfileForm')
                window.dispatchEvent(event)
              }}
              className="px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-black font-semibold rounded-2xl hover:from-accent/90 hover:to-accent/70 transition-all duration-200 shadow-lg shadow-accent/25"
            >
              Submit Your Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile, index) => (
              <div key={profile.id}>
                <ProfileCard
                  profile={profile}
                  onClick={() => handleProfileClick(profile)}
                />
                
                {/* Insert ad every 6 profiles (2 rows of 3) */}
                {(index + 1) % 6 === 0 && advertisements.length > 0 && (
                  <div className="md:col-span-2 lg:col-span-3 mt-6 mb-6">
                    <AdCard ad={advertisements[Math.floor(Math.random() * advertisements.length)]} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ProfileModal
        profile={selectedProfile}
        isOpen={isModalOpen}
        onClose={closeModal}
        onViewFullProfile={onViewFullProfile || (() => {})}
      />
    </>
  )
}