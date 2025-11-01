import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { ArrowLeft, MapPin, Clock, User, Star, Globe, Calendar, Plus, Share2 } from 'lucide-react'
import { useTheme } from '../lib/theme.tsx'
import { supabase } from '../lib/supabase'
import type { Profile } from '../lib/supabase'

interface ProfilePageProps {
  profile: Profile
  onBack: () => void
}

export function ProfilePage({ profile, onBack }: ProfilePageProps) {
  const { theme } = useTheme()
  const [suggestedProfiles, setSuggestedProfiles] = useState<Profile[]>([])

  useEffect(() => {
    fetchSuggestedProfiles()
  }, [profile.id])

  const fetchSuggestedProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('approved', true)
        .neq('id', profile.id)
        .limit(3)

      if (!error && data) {
        setSuggestedProfiles(data as Profile[])
      }
    } catch (error) {
      console.error('Error fetching suggested profiles:', error)
    }
  }

  const handleShareProfile = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${profile.id}`
      const shareData = {
        title: `${profile.full_name} - ${profile.role} on CofounderBase`,
        text: `Check out ${profile.full_name}'s profile on CofounderBase`,
        url: profileUrl
      }

      if (navigator.share) {
        try {
          await navigator.share(shareData)
        } catch (error) {
          await navigator.clipboard.writeText(profileUrl)
          alert('Profile link copied to clipboard!')
        }
      } else {
        await navigator.clipboard.writeText(profileUrl)
        alert('Profile link copied to clipboard!')
      }
    } catch (error) {
      console.error('Share profile error:', error)
    }
  }

  const handleProfileClick = (profileId: string | undefined) => {
    if (profileId) {
      window.location.href = `/profile/${profileId}`
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className={`hover:bg-emerald-500/10 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleShareProfile}
                className={`${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'}`}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Profile Header - Minimal Design */}
          <Card className={`border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  {profile.headshot_url ? (
                    <img
                      src={profile.headshot_url}
                      alt={profile.full_name}
                      className="w-32 h-32 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <User className="w-16 h-16 text-emerald-500" />
                    </div>
                  )}
                  {profile.featured && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" fill="white" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {profile.full_name}
                      </h1>
                      <Badge 
                        variant="outline" 
                        className={`${
                          profile.role === 'founder' 
                            ? 'border-blue-500/50 text-blue-500' 
                            : profile.role === 'cofounder'
                            ? 'border-emerald-500/50 text-emerald-500'
                            : 'border-yellow-500/50 text-yellow-500'
                        } capitalize`}
                      >
                        {profile.role}
                      </Badge>
                    </div>
                    
                    <div className={`flex flex-wrap gap-4 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                      {profile.timezone && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {profile.timezone}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined {new Date(profile.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-0">
                      {profile.availability}
                    </Badge>
                    {profile.featured && (
                      <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0">
                        ⭐ Featured
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      onClick={() => {
                        const linkedinUrl = profile.linkedin_profile
                        if (linkedinUrl && (linkedinUrl.startsWith('https://linkedin.com/') || linkedinUrl.startsWith('https://www.linkedin.com/'))) {
                          window.open(linkedinUrl, '_blank', 'noopener,noreferrer')
                        }
                      }}
                      className="bg-[#0077B5] hover:bg-[#005885] text-white"
                      size="sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </Button>
                    {profile.website_portfolio && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          const websiteUrl = profile.website_portfolio
                          if (websiteUrl && (websiteUrl.startsWith('https://') || websiteUrl.startsWith('http://'))) {
                            window.open(websiteUrl, '_blank', 'noopener,noreferrer')
                          }
                        }}
                        className={`${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'}`}
                        size="sm"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Portfolio
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <Card className={`border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardContent className="p-6">
                  <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>About</h2>
                  <p className={`leading-relaxed ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                    {profile.short_bio}
                  </p>
                </CardContent>
              </Card>

              {/* Role-specific sections remain the same but with updated styling */}
              {profile.role === 'founder' && profile.startup_name && (
                <Card className={`border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <CardContent className="p-6 space-y-4">
                    <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Startup</h2>
                    <div>
                      <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Company</p>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{profile.startup_name}</p>
                    </div>
                    {profile.industry && (
                      <div>
                        <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Industry</p>
                        <Badge variant="outline">{profile.industry}</Badge>
                      </div>
                    )}
                    {profile.what_building && (
                      <div>
                        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>What We're Building</p>
                        <p className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{profile.what_building}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {profile.role === 'cofounder' && profile.skills_expertise && (
                <Card className={`border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <CardContent className="p-6 space-y-4">
                    <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills_expertise.split(',').map((skill, index) => (
                        <Badge key={index} variant="outline">{skill.trim()}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card className={`border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <CardContent className="p-6 space-y-4">
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Quick Info</h3>
                  <div className="space-y-3">
                    <div>
                      <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Looking For</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{profile.looking_for}</p>
                    </div>
                    <div>
                      <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Availability</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{profile.availability}</p>
                    </div>
                    {profile.timezone && (
                      <div>
                        <p className={`text-xs mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>Timezone</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{profile.timezone}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Profiles */}
              {suggestedProfiles.length > 0 && (
                <Card className={`border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <CardContent className="p-6 space-y-4">
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>More Profiles</h3>
                    <div className="space-y-3">
                      {suggestedProfiles.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleProfileClick(p.id)}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`}
                        >
                          {p.headshot_url ? (
                            <img src={p.headshot_url} alt={p.full_name} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-emerald-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{p.full_name}</p>
                            <p className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{p.role} • {p.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      className={`w-full ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'}`}
                      onClick={onBack}
                      size="sm"
                    >
                      View All
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>


    </div>
  )
}
