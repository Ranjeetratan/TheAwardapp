import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Users, UserCheck, UserX, TrendingUp, Star, Plus, Edit, Trash2, Megaphone, LogOut, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Profile, Advertisement } from '../lib/supabase'

interface AdminPanelProps {
  onLogout: () => void
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
  const [activeTab, setActiveTab] = useState<'profiles' | 'ads'>('profiles')
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null)
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    cta_text: '',
    cta_url: '',
    is_active: true
  })
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetchProfiles()
    fetchAdvertisements()
  }, [])

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching profiles:', error)
        // Mock data for demo
        const mockProfiles: Profile[] = [
          {
            id: '1',
            full_name: 'John Doe',
            email: 'john@example.com',
            location: 'San Francisco, CA',
            linkedin_profile: 'https://linkedin.com/in/johndoe',
            short_bio: 'Experienced entrepreneur looking to build the next big thing in AI/ML.',
            availability: 'Full-time',
            looking_for: 'Technical Co-founder',
            role: 'founder',
            startup_name: 'AI Startup',
            startup_stage: 'Seed',
            industry: 'AI/ML',
            approved: false,
            featured: false,
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            full_name: 'Jane Smith',
            email: 'jane@example.com',
            location: 'New York, NY',
            linkedin_profile: 'https://linkedin.com/in/janesmith',
            short_bio: 'Full-stack developer with 8 years of experience.',
            availability: 'Part-time',
            looking_for: 'Startup Opportunity',
            role: 'cofounder',
            skills_expertise: 'React, Node.js, Python',
            experience_level: 'Expert',
            approved: true,
            featured: true,
            created_at: new Date().toISOString()
          }
        ]
        setProfiles(mockProfiles)
        calculateStats(mockProfiles)
      } else {
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
            cta_url: 'mailto:contact@cofounderbase.com?subject=MVP Development Inquiry',
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

  const handleApprove = async (profileId: string | undefined) => {
    if (!profileId) return
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ approved: true })
        .eq('id', profileId)

      if (error) {
        console.error('Error approving profile:', error)
      } else {
        setProfiles(prev => prev.map(p => 
          p.id === profileId ? { ...p, approved: true } : p
        ))
        calculateStats(profiles.map(p => 
          p.id === profileId ? { ...p, approved: true } : p
        ))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleReject = async (profileId: string | undefined) => {
    if (!profileId) return
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId)

      if (error) {
        console.error('Error rejecting profile:', error)
      } else {
        const updatedProfiles = profiles.filter(p => p.id !== profileId)
        setProfiles(updatedProfiles)
        calculateStats(updatedProfiles)
      }
    } catch (error) {
      console.error('Error:', error)
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
        console.error('Error updating featured status:', error)
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
        console.error('Error creating advertisement:', error)
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

  const handleUpdateAd = async (ad: Advertisement) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({
          title: ad.title,
          description: ad.description,
          cta_text: ad.cta_text,
          cta_url: ad.cta_url,
          is_active: ad.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', ad.id)

      if (error) {
        console.error('Error updating advertisement:', error)
      } else {
        setAdvertisements(prev => prev.map(a => 
          a.id === ad.id ? ad : a
        ))
        setEditingAd(null)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

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

  const handleUpdateProfile = async (profile: Profile) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          location: profile.location,
          short_bio: profile.short_bio,
          linkedin_profile: profile.linkedin_profile,
          headshot_url: profile.headshot_url,
          startup_name: profile.startup_name,
          industry: profile.industry,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (error) {
        console.error('Error updating profile:', error)
      } else {
        setProfiles(prev => prev.map(p => 
          p.id === profile.id ? profile : p
        ))
        setEditingProfile(null)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#1a1a1a] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#1a1a1a] text-white">
      {/* Header */}
      <div className="border-b border-accent/20 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage profiles, monitor activity, and oversee platform operations
              </p>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-card/30 p-1 rounded-xl border border-accent/20">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'profiles'
                ? 'bg-accent text-black shadow-lg'
                : 'text-muted-foreground hover:text-white hover:bg-card/50'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Profile Management
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'ads'
                ? 'bg-accent text-black shadow-lg'
                : 'text-muted-foreground hover:text-white hover:bg-card/50'
            }`}
          >
            <Megaphone className="w-4 h-4 inline mr-2" />
            Advertisement Management
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
                <Users className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{stats.totalProfiles}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.approvedProfiles} approved, {stats.pendingProfiles} pending
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Founders</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.foundersCount}</div>
                <p className="text-xs text-muted-foreground">
                  Active startup founders
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cofounders</CardTitle>
                <UserCheck className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.cofoundersCount}</div>
                <p className="text-xs text-muted-foreground">
                  Available cofounders
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'profiles' && (
          <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
            <CardHeader>
              <CardTitle className="text-xl">Profile Management</CardTitle>
              <p className="text-muted-foreground">Review and manage user profiles</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profiles.map((profile) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-accent/10"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-white">{profile.full_name}</h3>
                        <Badge variant={profile.role === 'founder' ? 'default' : 'secondary'}>
                          {profile.role}
                        </Badge>
                        {profile.featured && (
                          <Badge className="bg-accent/20 text-accent">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <Badge variant={profile.approved ? 'default' : 'destructive'}>
                          {profile.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{profile.email}</p>
                      <p className="text-sm text-gray-300">{profile.short_bio}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {profile.location} • {profile.availability}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                      {!profile.approved ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(profile.id)}
                            className="bg-green-600 hover:bg-green-700"
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
                            className={profile.featured ? 'bg-accent/20 text-accent' : ''}
                          >
                            <Star className="w-4 h-4 mr-1" />
                            {profile.featured ? 'Unfeature' : 'Feature'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleHideProfile(profile.id)}
                            className="text-yellow-400 hover:bg-yellow-400/10"
                          >
                            <EyeOff className="w-4 h-4 mr-1" />
                            Hide
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProfile(profile)}
                            className="text-blue-400 hover:bg-blue-400/10"
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
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Profile Edit Modal */}
        {editingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <Card className="w-full max-w-2xl bg-card/95 backdrop-blur-xl border-accent/20 shadow-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="text-xl text-white">Edit Profile: {editingProfile.full_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                    <Input
                      value={editingProfile.full_name}
                      onChange={(e) => setEditingProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                      className="bg-background/50 border-accent/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Location</label>
                    <Input
                      value={editingProfile.location}
                      onChange={(e) => setEditingProfile(prev => prev ? { ...prev, location: e.target.value } : null)}
                      className="bg-background/50 border-accent/20"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">LinkedIn Profile</label>
                  <Input
                    value={editingProfile.linkedin_profile}
                    onChange={(e) => setEditingProfile(prev => prev ? { ...prev, linkedin_profile: e.target.value } : null)}
                    className="bg-background/50 border-accent/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Headshot URL</label>
                  <Input
                    value={editingProfile.headshot_url || ''}
                    onChange={(e) => setEditingProfile(prev => prev ? { ...prev, headshot_url: e.target.value } : null)}
                    placeholder="https://example.com/image.jpg"
                    className="bg-background/50 border-accent/20"
                  />
                </div>

                {editingProfile.role === 'founder' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Startup Name</label>
                      <Input
                        value={editingProfile.startup_name || ''}
                        onChange={(e) => setEditingProfile(prev => prev ? { ...prev, startup_name: e.target.value } : null)}
                        className="bg-background/50 border-accent/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Industry</label>
                      <Input
                        value={editingProfile.industry || ''}
                        onChange={(e) => setEditingProfile(prev => prev ? { ...prev, industry: e.target.value } : null)}
                        className="bg-background/50 border-accent/20"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Bio</label>
                  <Textarea
                    value={editingProfile.short_bio}
                    onChange={(e) => setEditingProfile(prev => prev ? { ...prev, short_bio: e.target.value } : null)}
                    className="bg-background/50 border-accent/20"
                    rows={4}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={() => handleUpdateProfile(editingProfile)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingProfile(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="space-y-6">
            {/* Create New Advertisement */}
            <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="text-xl">Create New Advertisement</CardTitle>
                <p className="text-muted-foreground">Add a new advertisement to display in the directory</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Title</label>
                    <Input
                      value={newAd.title}
                      onChange={(e) => setNewAd(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Advertisement title"
                      className="bg-background/50 border-accent/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">CTA Text</label>
                    <Input
                      value={newAd.cta_text}
                      onChange={(e) => setNewAd(prev => ({ ...prev, cta_text: e.target.value }))}
                      placeholder="Button text"
                      className="bg-background/50 border-accent/20"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">Description</label>
                  <Textarea
                    value={newAd.description}
                    onChange={(e) => setNewAd(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Advertisement description"
                    className="bg-background/50 border-accent/20"
                    rows={3}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-white mb-2">CTA URL</label>
                  <Input
                    value={newAd.cta_url}
                    onChange={(e) => setNewAd(prev => ({ ...prev, cta_url: e.target.value }))}
                    placeholder="https://example.com or mailto:contact@example.com"
                    className="bg-background/50 border-accent/20"
                  />
                </div>
                <Button
                  onClick={handleCreateAd}
                  className="bg-gradient-to-r from-accent to-accent/80 text-black hover:from-accent/90 hover:to-accent/70"
                  disabled={!newAd.title || !newAd.description || !newAd.cta_text || !newAd.cta_url}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Advertisement
                </Button>
              </CardContent>
            </Card>

            {/* Existing Advertisements */}
            <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
              <CardHeader>
                <CardTitle className="text-xl">Manage Advertisements</CardTitle>
                <p className="text-muted-foreground">Edit and manage existing advertisements</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {advertisements.map((ad) => (
                    <motion.div
                      key={ad.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-background/50 rounded-lg border border-accent/10"
                    >
                      {editingAd?.id === ad.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              value={editingAd.title}
                              onChange={(e) => setEditingAd(prev => prev ? { ...prev, title: e.target.value } : null)}
                              placeholder="Title"
                              className="bg-background/50 border-accent/20"
                            />
                            <Input
                              value={editingAd.cta_text}
                              onChange={(e) => setEditingAd(prev => prev ? { ...prev, cta_text: e.target.value } : null)}
                              placeholder="CTA Text"
                              className="bg-background/50 border-accent/20"
                            />
                          </div>
                          <Textarea
                            value={editingAd.description}
                            onChange={(e) => setEditingAd(prev => prev ? { ...prev, description: e.target.value } : null)}
                            placeholder="Description"
                            className="bg-background/50 border-accent/20"
                            rows={3}
                          />
                          <Input
                            value={editingAd.cta_url}
                            onChange={(e) => setEditingAd(prev => prev ? { ...prev, cta_url: e.target.value } : null)}
                            placeholder="CTA URL"
                            className="bg-background/50 border-accent/20"
                          />
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleUpdateAd(editingAd)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingAd(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-white">{ad.title}</h3>
                              <Badge variant={ad.is_active ? 'default' : 'secondary'}>
                                {ad.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-300 mb-2">{ad.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>CTA: {ad.cta_text}</span>
                              <span>URL: {ad.cta_url}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingAd(ad)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleAdStatus(ad.id, ad.is_active)}
                              className={ad.is_active ? 'text-yellow-400' : 'text-green-400'}
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
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}