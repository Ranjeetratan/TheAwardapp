import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// Removed unused Card imports
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { 
  Users, UserCheck, UserX, TrendingUp, Star, Plus, Edit, Trash2, Megaphone, LogOut, EyeOff, 
  BarChart3, DollarSign, Search, Globe, Mail, Linkedin, RefreshCw
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { sendProfileLiveEmail, getFirstName, generateProfileUrl } from '../lib/loop-email'
import { testGoogleAnalytics } from '../lib/analytics'
import { getAutoApprovalSetting, updateAutoApprovalSetting } from '../lib/settings'
import type { Profile, Advertisement } from '../lib/supabase'

interface AdminPanelProps {
  onLogout: () => void
}

// Add this to window for debugging
declare global {
  interface Window {
    testSupabaseConnection: () => Promise<void>
    testProfileInsert: () => Promise<void>
    debugProfileCounts: () => Promise<void>
    approveAllProfiles: () => Promise<void>
    testGoogleAnalytics: () => any
    createTestPendingProfile: () => Promise<void>
  }
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [stats, setStats] = useState({
    totalProfiles: 0,
    approvedProfiles: 0,
    pendingProfiles: 0,
    foundersCount: 0,
    cofoundersCount: 0,
    investorsCount: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'founders' | 'cofounders' | 'investors' | 'ads'>('overview')
  const [autoApprovalEnabled, setAutoApprovalEnabled] = useState(true)
  // editingAd removed - not used in current implementation
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    cta_text: '',
    cta_url: '',
    is_active: true
  })
  // editingProfile removed - not used in current implementation

  useEffect(() => {
    fetchProfiles()
    fetchAdvertisements()
    fetchAutoApprovalSetting()
    
    // Add debugging functions to window
    window.testSupabaseConnection = async () => {
      try {
        console.log('Testing Supabase connection...')
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact' })
        console.log('Connection test result:', { data, error })
        if (error) {
          console.error('Connection failed:', error)
        } else {
          console.log('Connection successful! Profile count:', data)
        }
      } catch (err) {
        console.error('Connection test error:', err)
      }
    }

    window.debugProfileCounts = async () => {
      try {
        console.log('=== DEBUGGING PROFILE COUNTS ===')
        
        // Get all profiles
        const { data: allProfiles, error: allError } = await supabase
          .from('profiles')
          .select('role, approved')
        
        if (allError) {
          console.error('Error fetching all profiles:', allError)
          return
        }

        // Get approved profiles only
        const { data: approvedProfiles, error: approvedError } = await supabase
          .from('profiles')
          .select('role, approved')
          .eq('approved', true)
        
        if (approvedError) {
          console.error('Error fetching approved profiles:', approvedError)
          return
        }

        console.log('ALL PROFILES:', allProfiles)
        console.log('APPROVED PROFILES:', approvedProfiles)
        
        // Count by role - all profiles
        const allCounts = allProfiles.reduce((acc: any, p: any) => {
          acc[p.role] = (acc[p.role] || 0) + 1
          return acc
        }, {})
        
        // Count by role - approved profiles
        const approvedCounts = approvedProfiles.reduce((acc: any, p: any) => {
          acc[p.role] = (acc[p.role] || 0) + 1
          return acc
        }, {})
        
        console.log('ALL PROFILE COUNTS:', allCounts)
        console.log('APPROVED PROFILE COUNTS:', approvedCounts)
        
        // Show unapproved profiles
        const unapproved = allProfiles.filter(p => !p.approved)
        console.log('UNAPPROVED PROFILES:', unapproved)
        
      } catch (err) {
        console.error('Debug error:', err)
      }
    }
    
    window.testProfileInsert = async () => {
      try {
        console.log('Testing profile insert...')
        const testProfile = {
          full_name: 'Test User',
          email: 'test@example.com',
          location: 'Test City',
          linkedin_profile: 'https://linkedin.com/in/test',
          short_bio: 'Test bio',
          availability: 'Full-time',
          looking_for: 'Test',
          role: 'founder' as const,
          approved: true,
          featured: false
        }
        const { data, error } = await supabase.from('profiles').insert([testProfile]).select()
        console.log('Insert test result:', { data, error })
      } catch (err) {
        console.error('Insert test error:', err)
      }
    }

    window.approveAllProfiles = async () => {
      try {
        console.log('Approving all pending profiles...')
        const { data, error } = await supabase
          .from('profiles')
          .update({ approved: true })
          .eq('approved', false)
          .select()
        
        if (error) {
          console.error('Error approving profiles:', error)
        } else {
          console.log('Successfully approved profiles:', data)
          // Refresh the admin panel data
          fetchProfiles()
        }
      } catch (err) {
        console.error('Approve all error:', err)
      }
    }

    window.testGoogleAnalytics = () => {
      return testGoogleAnalytics()
    }

    window.createTestPendingProfile = async () => {
      try {
        console.log('Creating test pending profile...')
        const testProfile = {
          full_name: 'Test Pending User',
          email: 'pending@example.com',
          location: 'Test City',
          linkedin_profile: 'https://linkedin.com/in/testpending',
          short_bio: 'Test pending profile for approval testing',
          availability: 'Full-time',
          looking_for: 'Test approval flow',
          role: 'founder' as const,
          startup_name: 'Test Startup',
          startup_stage: 'Idea',
          industry: 'Testing',
          approved: false, // This will create a pending profile
          featured: false
        }
        const { data, error } = await supabase.from('profiles').insert([testProfile]).select()
        
        if (error) {
          console.error('Error creating test profile:', error)
        } else {
          console.log('Test pending profile created:', data)
          fetchProfiles() // Refresh the admin panel
        }
      } catch (err) {
        console.error('Create test profile error:', err)
      }
    }
  }, [])

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      console.log('Fetching profiles from Supabase...')
      console.log('Supabase configuration check completed')
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching profiles:', {
          message: error.message,
          code: error.code,
          timestamp: new Date().toISOString()
        })
        alert('Database error. Please check your configuration.')
        setProfiles([])
        calculateStats([])
      } else {
        console.log('Successfully fetched profiles:', data?.length || 0)
        setProfiles(data || [])
        calculateStats(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAdvertisements = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching advertisements:', error)
        // Mock data for demo
        const mockAds: Advertisement[] = [
          {
            id: '1',
            title: 'Looking to build your MVP?',
            description: '$1000 for the planning, Miro Board and the MVP. Get your startup idea validated and built by experts.',
            cta_text: 'Get Started',
            cta_url: 'mailto:ranjit.kumar.ds@gmail.com?subject=MVP Development Inquiry',
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
        setAdvertisements(mockAds)
      } else {
        setAdvertisements(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const calculateStats = (profileData: Profile[]) => {
    const totalProfiles = profileData.length
    const approvedProfiles = profileData.filter(p => p.approved).length
    const pendingProfiles = profileData.filter(p => !p.approved).length
    const foundersCount = profileData.filter(p => p.role === 'founder').length
    const cofoundersCount = profileData.filter(p => p.role === 'cofounder').length
    const investorsCount = profileData.filter(p => p.role === 'investor').length

    setStats({
      totalProfiles,
      approvedProfiles,
      pendingProfiles,
      foundersCount,
      cofoundersCount,
      investorsCount
    })
  }

  const fetchAutoApprovalSetting = async () => {
    try {
      const setting = await getAutoApprovalSetting()
      setAutoApprovalEnabled(setting)
    } catch (error) {
      console.error('Error fetching auto-approval setting:', error)
    }
  }

  const handleToggleAutoApproval = async () => {
    try {
      const newSetting = !autoApprovalEnabled
      const success = await updateAutoApprovalSetting(newSetting)
      
      if (success) {
        setAutoApprovalEnabled(newSetting)
        alert(`Auto-approval ${newSetting ? 'enabled' : 'disabled'} successfully!`)
      } else {
        alert('Failed to update auto-approval setting')
      }
    } catch (error) {
      console.error('Error toggling auto-approval:', error)
      alert('Error updating auto-approval setting')
    }
  }

  const handleApprove = async (profileId: string | undefined) => {
    if (!profileId) return
    
    // Find the profile to get user details for email
    const profile = profiles.find(p => p.id === profileId)
    if (!profile) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ approved: true })
        .eq('id', profileId)

      if (error) {
        console.error('Error approving profile:', {
          message: error.message,
          timestamp: new Date().toISOString()
        })
        alert('Error approving profile. Please try again.')
      } else {
        // Update local state
        const updatedProfiles = profiles.map(p => 
          p.id === profileId ? { ...p, approved: true } : p
        )
        setProfiles(updatedProfiles)
        calculateStats(updatedProfiles)

        // Send profile live email notification
        try {
          const emailSent = await sendProfileLiveEmail({
            first_name: getFirstName(profile.full_name),
            profile_url: generateProfileUrl(profileId),
            full_name: profile.full_name,
            email: profile.email,
            role: profile.role
          })

          if (emailSent) {
            alert('Profile approved successfully! Welcome email sent to user.')
          } else {
            alert('Profile approved successfully! (Email notification failed - check Loop configuration)')
          }
        } catch (emailError) {
          console.error('Email notification error:', {
            message: emailError instanceof Error ? emailError.message : 'Unknown error',
            timestamp: new Date().toISOString()
          })
          alert('Profile approved successfully! (Email notification failed)')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleReject = async (profileId: string | undefined) => {
    if (!profileId) return
    if (!confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      return
    }
    
    try {
      console.log('Attempting to delete profile with ID:', profileId)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId)
        .select()

      console.log('Profile deletion completed')

      if (error) {
        console.error('Error deleting profile:', {
          message: error.message,
          timestamp: new Date().toISOString()
        })
        alert('Error deleting profile. Please try again.')
      } else {
        console.log('Profile deleted successfully')
        const updatedProfiles = profiles.filter(p => p.id !== profileId)
        setProfiles(updatedProfiles)
        calculateStats(updatedProfiles)
        alert('Profile deleted successfully!')
      }
    } catch (error) {
      console.error('Network error:', error)
      alert('Network error. Please try again.')
    }
  }

  const handleFeature = async (profileId: string | undefined, featured?: boolean) => {
    if (!profileId) return
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ featured: !featured })
        .eq('id', profileId)

      if (error) {
        console.error('Error updating featured status:', {
          message: error.message,
          timestamp: new Date().toISOString()
        })
      } else {
        setProfiles(prev => prev.map(p => 
          p.id === profileId ? { ...p, featured: !featured } : p
        ))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleCreateAd = async () => {
    if (!newAd.title || !newAd.description || !newAd.cta_text || !newAd.cta_url) return
    
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .insert([{
          ...newAd,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()

      if (error) {
        console.error('Error creating advertisement:', {
          message: error.message,
          timestamp: new Date().toISOString()
        })
      } else {
        setAdvertisements(prev => [data[0], ...prev])
        setNewAd({
          title: '',
          description: '',
          cta_text: '',
          cta_url: '',
          is_active: true
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // handleUpdateAd removed - not used in current implementation

  const handleDeleteAd = async (adId: string) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', adId)

      if (error) {
        console.error('Error deleting advertisement:', error)
      } else {
        setAdvertisements(prev => prev.filter(a => a.id !== adId))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleToggleAdStatus = async (adId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ 
          is_active: !isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', adId)

      if (error) {
        console.error('Error toggling ad status:', error)
      } else {
        setAdvertisements(prev => prev.map(a => 
          a.id === adId ? { ...a, is_active: !isActive } : a
        ))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleHideProfile = async (profileId: string | undefined) => {
    if (!profileId) return
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ approved: false })
        .eq('id', profileId)

      if (error) {
        console.error('Error hiding profile:', error)
      } else {
        setProfiles(prev => prev.map(p => 
          p.id === profileId ? { ...p, approved: false } : p
        ))
        calculateStats(profiles.map(p => 
          p.id === profileId ? { ...p, approved: false } : p
        ))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // handleUpdateProfile removed - not used in current implementation

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {profiles.slice(0, 5).map((profile) => (
                  <div key={profile.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center">
                      {profile.headshot_url ? (
                        <img
                          src={profile.headshot_url}
                          alt={profile.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-black">
                          {profile.full_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{profile.full_name}</p>
                      <p className="text-xs text-gray-400">{profile.role} • {profile.location}</p>
                    </div>
                    <Badge variant={profile.approved ? 'default' : 'destructive'} className="text-xs">
                      {profile.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setActiveTab('founders')}
                  className="p-4 bg-purple-500/20 rounded-xl text-left hover:bg-purple-500/30 transition-colors"
                >
                  <TrendingUp className="w-6 h-6 text-purple-400 mb-2" />
                  <p className="text-sm font-medium text-white">Manage Founders</p>
                  <p className="text-xs text-gray-400">{stats.foundersCount} profiles</p>
                </button>
                <button
                  onClick={() => setActiveTab('cofounders')}
                  className="p-4 bg-green-500/20 rounded-xl text-left hover:bg-green-500/30 transition-colors"
                >
                  <Users className="w-6 h-6 text-green-400 mb-2" />
                  <p className="text-sm font-medium text-white">Manage Co-founders</p>
                  <p className="text-xs text-gray-400">{stats.cofoundersCount} profiles</p>
                </button>
                <button
                  onClick={() => setActiveTab('investors')}
                  className="p-4 bg-yellow-500/20 rounded-xl text-left hover:bg-yellow-500/30 transition-colors"
                >
                  <DollarSign className="w-6 h-6 text-yellow-400 mb-2" />
                  <p className="text-sm font-medium text-white">Manage Investors</p>
                  <p className="text-xs text-gray-400">{stats.investorsCount} profiles</p>
                </button>
                <button
                  onClick={() => setActiveTab('ads')}
                  className="p-4 bg-blue-500/20 rounded-xl text-left hover:bg-blue-500/30 transition-colors"
                >
                  <Megaphone className="w-6 h-6 text-blue-400 mb-2" />
                  <p className="text-sm font-medium text-white">Manage Ads</p>
                  <p className="text-xs text-gray-400">{advertisements.length} active</p>
                </button>
              </div>
            </div>
          </div>
        )

      case 'founders':
      case 'cofounders':
      case 'investors':
        return renderProfileSection(activeTab)

      case 'ads':
        return renderAdvertisementSection()

      default:
        return null
    }
  }

  const renderProfileSection = (role: string) => {
    const filteredProfiles = profiles.filter(profile => profile.role === role.slice(0, -1)) // Remove 's' from end
    const roleConfig = {
      founders: { title: 'Founders', icon: TrendingUp, color: 'purple' },
      cofounders: { title: 'Co-founders', icon: Users, color: 'green' },
      investors: { title: 'Investors', icon: DollarSign, color: 'yellow' }
    }[role] || { title: role, icon: Users, color: 'blue' }

    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-${roleConfig.color}-500/20 rounded-xl flex items-center justify-center`}>
                <roleConfig.icon className={`w-5 h-5 text-${roleConfig.color}-400`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{roleConfig.title}</h2>
                <p className="text-sm text-gray-400">{filteredProfiles.length} profiles</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {filteredProfiles.map((profile) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center">
                      {profile.headshot_url ? (
                        <img
                          src={profile.headshot_url}
                          alt={profile.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-black">
                          {profile.full_name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-white">{profile.full_name}</h3>
                        {profile.featured && (
                          <Badge className="bg-accent/20 text-accent text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant={profile.approved ? 'default' : 'destructive'} className="text-xs">
                          {profile.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{profile.short_bio}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span>{profile.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{profile.email}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Linkedin className="w-3 h-3" />
                          <span>LinkedIn</span>
                        </span>
                      </div>
                      {role === 'founders' && profile.startup_name && (
                        <div className="mt-2 p-2 bg-white/5 rounded-lg">
                          <p className="text-xs text-gray-400">Startup: <span className="text-white">{profile.startup_name}</span></p>
                          <p className="text-xs text-gray-400">Industry: <span className="text-white">{profile.industry}</span></p>
                        </div>
                      )}
                      {role === 'investors' && profile.investment_range && (
                        <div className="mt-2 p-2 bg-white/5 rounded-lg">
                          <p className="text-xs text-gray-400">Range: <span className="text-white">{profile.investment_range}</span></p>
                          <p className="text-xs text-gray-400">Focus: <span className="text-white">{profile.investment_focus}</span></p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!profile.approved ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(profile.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <UserCheck className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(profile.id)}
                        >
                          <UserX className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFeature(profile.id, profile.featured)}
                          className={profile.featured ? 'bg-accent/20 text-accent border-accent/50' : 'border-white/20 text-white hover:bg-white/10'}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          {profile.featured ? 'Unfeature' : 'Feature'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleHideProfile(profile.id)}
                          className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                        >
                          <EyeOff className="w-4 h-4 mr-1" />
                          Hide
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => alert('Edit functionality coming soon')}
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(profile.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderAdvertisementSection = () => {
    return (
      <div className="space-y-6">
        {/* Create New Ad */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white mb-4">Create New Advertisement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              value={newAd.title}
              onChange={(e) => setNewAd(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Advertisement title"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
            <Input
              value={newAd.cta_text}
              onChange={(e) => setNewAd(prev => ({ ...prev, cta_text: e.target.value }))}
              placeholder="Button text"
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
          <Textarea
            value={newAd.description}
            onChange={(e) => setNewAd(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Advertisement description"
            className="bg-white/10 border-white/20 text-white placeholder-gray-400 mb-4"
            rows={3}
          />
          <Input
            value={newAd.cta_url}
            onChange={(e) => setNewAd(prev => ({ ...prev, cta_url: e.target.value }))}
            placeholder="https://example.com or mailto:contact@example.com"
            className="bg-white/10 border-white/20 text-white placeholder-gray-400 mb-4"
          />
          <Button
            onClick={handleCreateAd}
            className="bg-gradient-to-r from-accent to-accent/80 text-black hover:from-accent/90 hover:to-accent/70"
            disabled={!newAd.title || !newAd.description || !newAd.cta_text || !newAd.cta_url}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Advertisement
          </Button>
        </div>

        {/* Existing Ads */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Manage Advertisements</h2>
            <p className="text-sm text-gray-400">{advertisements.length} advertisements</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {advertisements.map((ad) => (
                <div key={ad.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-white">{ad.title}</h3>
                        <Badge variant={ad.is_active ? 'default' : 'secondary'}>
                          {ad.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{ad.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>CTA: {ad.cta_text}</span>
                        <span>URL: {ad.cta_url}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert('Edit functionality coming soon')}
                        className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleAdStatus(ad.id, ad.is_active)}
                        className={ad.is_active ? 'border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10' : 'border-green-500/50 text-green-400 hover:bg-green-500/10'}
                      >
                        {ad.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteAd(ad.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Modern Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-accent/80 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CofounderBase Admin</h1>
                <p className="text-sm text-gray-400">Dashboard & Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleToggleAutoApproval}
                variant="outline"
                size="sm"
                className={`border-white/20 text-white hover:bg-white/10 ${
                  autoApprovalEnabled ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'
                }`}
              >
                {autoApprovalEnabled ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Auto-Approve: ON
                  </>
                ) : (
                  <>
                    <UserX className="w-4 h-4 mr-2" />
                    Auto-Approve: OFF
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  fetchProfiles()
                  fetchAdvertisements()
                  fetchAutoApprovalSetting()
                }}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {stats.pendingProfiles > 0 && (
                <Button
                  onClick={async () => {
                    if (confirm(`Approve all ${stats.pendingProfiles} pending profiles?`)) {
                      try {
                        const { error } = await supabase
                          .from('profiles')
                          .update({ approved: true })
                          .eq('approved', false)
                        
                        if (error) {
                          alert('Error approving profiles: ' + error.message)
                        } else {
                          alert(`Successfully approved ${stats.pendingProfiles} profiles!`)
                          fetchProfiles()
                        }
                      } catch (err) {
                        alert('Error: ' + err)
                      }
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Approve All ({stats.pendingProfiles})
                </Button>
              )}
              <Button
                onClick={onLogout}
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Profiles</p>
                <p className="text-3xl font-bold text-white">{stats.totalProfiles}</p>
                <p className="text-xs text-green-400 mt-1">
                  {stats.approvedProfiles} approved, {stats.pendingProfiles} pending
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Founders</p>
                <p className="text-3xl font-bold text-white">{stats.foundersCount}</p>
                <p className="text-xs text-purple-400 mt-1">
                  {profiles.filter(p => p.role === 'founder' && p.approved).length} live
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Co-founders</p>
                <p className="text-3xl font-bold text-white">{stats.cofoundersCount}</p>
                <p className="text-xs text-green-400 mt-1">
                  {profiles.filter(p => p.role === 'cofounder' && p.approved).length} live
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Investors</p>
                <p className="text-3xl font-bold text-white">{stats.investorsCount}</p>
                <p className="text-xs text-yellow-400 mt-1">
                  {profiles.filter(p => p.role === 'investor' && p.approved).length} live
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Modern Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3, count: stats.totalProfiles },
            { id: 'founders', label: 'Founders', icon: TrendingUp, count: stats.foundersCount },
            { id: 'cofounders', label: 'Co-founders', icon: Users, count: stats.cofoundersCount },
            { id: 'investors', label: 'Investors', icon: DollarSign, count: stats.investorsCount },
            { id: 'ads', label: 'Advertisements', icon: Megaphone, count: advertisements.length }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-accent text-black shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-black/20' : 'bg-white/20'
                }`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Modern Content Sections */}
        {renderTabContent()}
      </div>
    </div>
  )
}
