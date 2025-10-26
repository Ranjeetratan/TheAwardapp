import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from './Header'
import { SearchBar } from './SearchBar'
import { HorizontalFilters } from './HorizontalFilters'
import { ProfileCard } from './ProfileCard'
import { ProfileModal } from './ProfileModal'
import { ProfileForm } from './ProfileForm'
import { ProfilePage } from './ProfilePage'
import { WhatsNext } from './WhatsNext'
import { FAQ } from './FAQ'
import { Footer } from './Footer'
import { profileCache, preloadProfiles } from '../App'
import type { Profile } from '../lib/supabase'

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showProfilePage, setShowProfilePage] = useState(false)
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const [showStickySearch, setShowStickySearch] = useState(true)
  const faqRef = useRef<HTMLDivElement>(null)
  const whatsNextRef = useRef<HTMLDivElement>(null)
  const [activeRoleFilter, setActiveRoleFilter] = useState<'all' | 'founder' | 'cofounder' | 'investor'>('all')
  const [filters, setFilters] = useState({
    location: [] as string[],
    industry: [] as string[],
    availability: [] as string[],
    stage: [] as string[],
    experience: [] as string[],
    investmentRange: [] as string[],
    investmentType: [] as string[],
    skills: [] as string[],
    lookingFor: [] as string[],
    companySize: [] as string[],
    fundingStage: [] as string[]
  })

  const roles = ['Founder', 'Co-founder', 'Investor']

  useEffect(() => {
    fetchProfiles()
  }, [])

  // Refresh profiles when returning to homepage
  useEffect(() => {
    const handleFocus = () => {
      fetchProfiles()
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Animate role text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Handle scroll to hide sticky search when WhatsNext is reached
  useEffect(() => {
    const handleScroll = () => {
      if (whatsNextRef.current) {
        const whatsNextTop = whatsNextRef.current.offsetTop
        const scrollPosition = window.scrollY + window.innerHeight
        
        // Hide sticky search when WhatsNext section is in view (with smooth transition)
        setShowStickySearch(scrollPosition < whatsNextTop + 300)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchProfiles = async () => {
    // Check if we have cached profiles first
    if (profileCache.length > 0) {
      setProfiles(profileCache)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      // Use the preload function which handles caching
      const cachedProfiles = await preloadProfiles()
      setProfiles(cachedProfiles)
    } catch (error) {
      console.error('Error fetching profiles:', error)
      setProfiles([])
    } finally {
      setLoading(false)
    }
  }

  // Helper function to properly capitalize names and titles
  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    )
  }

  // Process profiles to ensure proper casing and sort by role priority
  const processedProfiles = profiles.map(profile => ({
    ...profile,
    full_name: toTitleCase(profile.full_name),
    startup_name: profile.startup_name ? toTitleCase(profile.startup_name) : profile.startup_name,
    location: toTitleCase(profile.location),
    industry: profile.industry ? toTitleCase(profile.industry) : profile.industry,
    role: profile.role.toLowerCase() as 'founder' | 'cofounder' | 'investor'
  })).sort((a, b) => {
    // Define role priority: founders first, then cofounders, then investors
    const rolePriority = { founder: 1, cofounder: 2, investor: 3 }
    
    // First sort by role priority
    const roleComparison = rolePriority[a.role] - rolePriority[b.role]
    if (roleComparison !== 0) return roleComparison
    
    // Within same role, prioritize featured profiles
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    
    // Finally sort by creation date (newest first)
    return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
  })

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => {
      const currentFilter = prev[filterType as keyof typeof prev]
      const isSelected = currentFilter.includes(value)
      
      return {
        ...prev,
        [filterType]: isSelected
          ? currentFilter.filter(item => item !== value)
          : [...currentFilter, value]
      }
    })
  }

  const handleClearFilters = () => {
    setFilters({
      location: [],
      industry: [],
      availability: [],
      stage: [],
      experience: [],
      investmentRange: [],
      investmentType: [],
      skills: [],
      lookingFor: [],
      companySize: [],
      fundingStage: []
    })
  }

  const filteredProfiles = processedProfiles.filter(profile => {
    // Role filter
    if (activeRoleFilter !== 'all' && profile.role !== activeRoleFilter) {
      return false
    }

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = (
        profile.full_name.toLowerCase().includes(searchLower) ||
        profile.short_bio.toLowerCase().includes(searchLower) ||
        profile.location.toLowerCase().includes(searchLower) ||
        (profile.startup_name && profile.startup_name.toLowerCase().includes(searchLower)) ||
        (profile.industry && profile.industry.toLowerCase().includes(searchLower)) ||
        (profile.skills_expertise && profile.skills_expertise.toLowerCase().includes(searchLower))
      )
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

    // Investment range filter (for investors)
    if (filters.investmentRange.length > 0 && profile.role === 'investor' && profile.investment_range) {
      if (!filters.investmentRange.includes(profile.investment_range)) return false
    }

    // Investment type filter (for investors)
    if (filters.investmentType.length > 0 && profile.role === 'investor' && profile.investment_stage) {
      if (!filters.investmentType.includes(profile.investment_stage)) return false
    }

    return true
  })

  const handleSubmitProfile = () => {
    console.log('Submit profile clicked')
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    // Refresh profiles when returning from form to show any new submissions
    fetchProfiles()
  }

  const handleProfileClick = (profile: Profile) => {
    // Navigate to profile URL
    const profileUrl = `/profile/${profile.id}`
    window.history.pushState({}, '', profileUrl)
    setSelectedProfile(profile)
    setShowProfilePage(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedProfile(null)
  }

  const handleViewFullProfile = (profile: Profile) => {
    setSelectedProfile(profile)
    setShowProfilePage(true)
    setIsModalOpen(false)
  }

  const handleBackFromProfile = () => {
    // Navigate back to home
    window.history.pushState({}, '', '/')
    setShowProfilePage(false)
    setSelectedProfile(null)
  }

  if (showProfilePage && selectedProfile) {
    return (
      <ProfilePage 
        profile={selectedProfile}
        onBack={handleBackFromProfile}
      />
    )
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Header onSubmitProfile={handleSubmitProfile} />
        <div className="relative">
          <button
            onClick={handleCloseForm}
            className="absolute top-6 left-6 z-10 text-accent hover:text-accent/80 text-sm font-medium"
          >
            ← Back to Directory
          </button>
          <ProfileForm onSuccess={handleCloseForm} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header 
        onSubmitProfile={handleSubmitProfile} 
        onLogoClick={() => window.location.reload()}
      />
      
      {/* Hero Section */}
      <section className="pt-12 pb-6 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white leading-tight"
            >
              <div className="mb-4">Find Your Perfect</div>
              <div className="h-16 sm:h-18 md:h-20 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentRoleIndex}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -50, rotateX: 90 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 bg-clip-text text-transparent"
                  >
                    {roles[currentRoleIndex]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Connect with ambitious founders and talented co-founders who share your vision and complement your skills.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitProfile}
                className="px-8 py-4 bg-gradient-to-r from-accent to-accent/80 text-black font-semibold rounded-2xl hover:from-accent/90 hover:to-accent/70 transition-all duration-200 shadow-lg shadow-accent/25 text-lg"
              >
                Get Started Today
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('[data-profiles-section]')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-accent/30 text-accent font-semibold rounded-2xl hover:bg-accent/10 transition-all duration-200 text-lg"
              >
                Browse Profiles
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Sticky Search and Filters */}
      <motion.div 
        className="sticky top-20 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10"
        animate={{
          opacity: showStickySearch ? 1 : 0,
          y: showStickySearch ? 0 : -100,
        }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1]
        }}
        style={{
          pointerEvents: showStickySearch ? 'auto' : 'none'
        }}
      >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-2xl mx-auto mb-4"
            >
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search profiles..."
              />
            </motion.div>
            
            {/* Role Filter Buttons */}
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2 bg-card/30 p-1 rounded-xl border border-accent/20">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'founder', label: 'Founders' },
                  { key: 'cofounder', label: 'Co-founders' },
                  { key: 'investor', label: 'Investors' }
                ].map((role) => (
                  <button
                    key={role.key}
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveRoleFilter(role.key as any)
                      // Scroll to top of profiles section smoothly
                      document.querySelector('[data-profiles-section]')?.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                      })
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeRoleFilter === role.key
                        ? 'bg-accent text-black shadow-lg'
                        : 'text-muted-foreground hover:text-white hover:bg-card/50'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <HorizontalFilters
                activeTab={activeRoleFilter === 'all' ? 'all' : activeRoleFilter === 'founder' ? 'founders' : activeRoleFilter === 'cofounder' ? 'cofounders' : 'investors'}
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>
      </motion.div>

      {/* Profiles Grid */}
      <section className="px-6 lg:px-8 py-12" data-profiles-section>
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
            >
              {/* Skeleton Loading Cards */}
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="bg-card/30 backdrop-blur-sm rounded-2xl border border-accent/10 animate-pulse">
                  <div className="aspect-[4/3] bg-gray-700 rounded-t-2xl mb-3"></div>
                  <div className="p-3">
                    <div className="h-3 bg-gray-700 rounded mb-2"></div>
                    <div className="h-2 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-700 rounded"></div>
                      <div className="h-2 bg-gray-700 rounded w-4/5"></div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : filteredProfiles.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  🔍
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No profiles found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery 
                  ? "Try adjusting your search to find more profiles."
                  : "Be the first to join our directory!"
                }
              </p>
              <button
                onClick={handleSubmitProfile}
                className="px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-black font-semibold rounded-lg hover:from-accent/90 hover:to-accent/70 transition-all duration-200"
              >
                Submit Your Profile
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
            >
              {filteredProfiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProfileCard
                    profile={profile}
                    onClick={() => handleProfileClick(profile)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* What's Next Section */}
      <div ref={whatsNextRef}>
        <WhatsNext />
      </div>

      {/* FAQ Section */}
      <div ref={faqRef}>
        <FAQ activeTab="all" />
      </div>

      {/* Call to Action Section */}
      <section className="py-16 px-6 lg:px-8 bg-gradient-to-b from-transparent to-card/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ready to find your cofounder?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of founders, technical cofounders, and investors building the future.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmitProfile}
              className="px-8 py-4 bg-gradient-to-r from-accent to-accent/80 text-black font-semibold rounded-2xl hover:from-accent/90 hover:to-accent/70 transition-all duration-200 shadow-lg shadow-accent/25 text-lg"
            >
              Submit Your Profile
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <ProfileModal
        profile={selectedProfile}
        isOpen={isModalOpen}
        onClose={closeModal}
        onViewFullProfile={handleViewFullProfile}
      />
    </div>
  )
}