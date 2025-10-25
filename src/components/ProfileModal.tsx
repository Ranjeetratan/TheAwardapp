import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { X, MapPin, Clock, Briefcase, User, Star, Globe, Eye, Mail } from 'lucide-react'
import { trackProfileView, trackContactClick } from '../lib/analytics'
import type { Profile } from '../lib/supabase'

interface ProfileModalProps {
  profile: Profile | null
  isOpen: boolean
  onClose: () => void
  onViewFullProfile: (profile: Profile) => void
}

export function ProfileModal({ profile, isOpen, onClose, onViewFullProfile }: ProfileModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Track profile view when modal opens
      if (profile) {
        trackProfileView(profile.id || 'unknown', profile.role)
      }
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, profile])

  // Helper function to properly capitalize names and titles
  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  }

  if (!profile) return null

  // Process profile for proper casing
  const processedProfile = {
    ...profile,
    full_name: toTitleCase(profile.full_name),
    startup_name: profile.startup_name ? toTitleCase(profile.startup_name) : profile.startup_name,
    location: toTitleCase(profile.location),
    industry: profile.industry ? toTitleCase(profile.industry) : profile.industry
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card className="bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl border border-accent/20 shadow-2xl">
              <CardContent className="p-0">
                {/* Header */}
                <div className="relative p-6 pb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>

                  <div className="flex items-start space-x-6">
                    {/* Profile Image */}
                    <div className="relative flex-shrink-0">
                      {processedProfile.headshot_url ? (
                        <img
                          src={processedProfile.headshot_url}
                          alt={processedProfile.full_name}
                          className="w-24 h-24 rounded-2xl object-cover border-2 border-accent/20"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border-2 border-accent/20">
                          {processedProfile.role === 'founder' ? (
                            <Briefcase className="w-12 h-12 text-accent" />
                          ) : (
                            <User className="w-12 h-12 text-accent" />
                          )}
                        </div>
                      )}
                      {processedProfile.featured && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-1">
                            {processedProfile.full_name}
                          </h2>
                          <div className="flex items-center space-x-4 text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{processedProfile.location}</span>
                            </div>
                            {processedProfile.timezone && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{processedProfile.timezone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`${processedProfile.role === 'founder' ? 'border-blue-500/50 text-blue-400' : 'border-green-500/50 text-green-400'} capitalize`}
                        >
                          {processedProfile.role}
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge variant="secondary" className="bg-accent/20 text-accent">
                          {profile.availability}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              trackContactClick('linkedin', profile.role)
                              window.open(profile.linkedin_profile, '_blank')
                            }}
                            className="bg-[#0077B5] hover:bg-[#005885] text-white flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                            LinkedIn
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              trackContactClick('email', profile.role)
                              window.open(`mailto:${profile.email}`, '_blank')
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-1"
                          >
                            <Mail className="w-4 h-4" />
                            Email
                          </Button>
                          <Button
                            size="sm"
                            onClick={async () => {
                              trackContactClick('share', profile.role)
                              const profileUrl = `${window.location.origin}/profile/${profile.id}`
                              if (navigator.share) {
                                try {
                                  await navigator.share({
                                    title: `${profile.full_name} - ${profile.role} on CofounderBase`,
                                    text: `Check out ${profile.full_name}'s profile on CofounderBase`,
                                    url: profileUrl
                                  })
                                } catch (err) {
                                  // Fallback to clipboard
                                  navigator.clipboard.writeText(profileUrl)
                                  alert('Profile URL copied to clipboard!')
                                }
                              } else {
                                // Fallback to clipboard
                                navigator.clipboard.writeText(profileUrl)
                                alert('Profile URL copied to clipboard!')
                              }
                            }}
                            className="bg-accent hover:bg-accent/90 text-black flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            Share
                          </Button>
                          {profile.website_portfolio && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(profile.website_portfolio!, '_blank')}
                              className="border-accent/30 text-accent hover:bg-accent/10"
                            >
                              <Globe className="w-4 h-4 mr-1" />
                              Website
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 space-y-6">
                  {/* Role-specific Information */}
                  {profile.role === 'founder' && (
                    <div className="bg-card/30 rounded-2xl p-4 border border-accent/10">
                      <h3 className="text-lg font-semibold text-accent mb-3">Startup Information</h3>
                      <div className="space-y-3">
                        {profile.startup_name && (
                          <div>
                            <span className="text-sm text-muted-foreground">Company:</span>
                            <p className="text-white font-medium">{profile.startup_name}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          {profile.startup_stage && (
                            <div>
                              <span className="text-sm text-muted-foreground">Stage:</span>
                              <p className="text-white">{profile.startup_stage}</p>
                            </div>
                          )}
                          {profile.industry && (
                            <div>
                              <span className="text-sm text-muted-foreground">Industry:</span>
                              <p className="text-white">{profile.industry}</p>
                            </div>
                          )}
                        </div>
                        {profile.what_building && (
                          <div>
                            <span className="text-sm text-muted-foreground">What we're building:</span>
                            <p className="text-white leading-relaxed">{profile.what_building}</p>
                          </div>
                        )}
                        {profile.looking_for_cofounder && (
                          <div>
                            <span className="text-sm text-muted-foreground">Looking for:</span>
                            <p className="text-white leading-relaxed">{profile.looking_for_cofounder}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {profile.role === 'cofounder' && (
                    <div className="bg-card/30 rounded-2xl p-4 border border-accent/10">
                      <h3 className="text-lg font-semibold text-accent mb-3">Skills & Experience</h3>
                      <div className="space-y-3">
                        {profile.skills_expertise && (
                          <div>
                            <span className="text-sm text-muted-foreground">Skills:</span>
                            <p className="text-white">{profile.skills_expertise}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          {profile.experience_level && (
                            <div>
                              <span className="text-sm text-muted-foreground">Experience:</span>
                              <p className="text-white">{profile.experience_level}</p>
                            </div>
                          )}
                          {profile.industry_interests && (
                            <div>
                              <span className="text-sm text-muted-foreground">Interests:</span>
                              <p className="text-white">{profile.industry_interests}</p>
                            </div>
                          )}
                        </div>
                        {profile.past_projects && (
                          <div>
                            <span className="text-sm text-muted-foreground">Past Projects:</span>
                            <p className="text-white leading-relaxed">{profile.past_projects}</p>
                          </div>
                        )}
                        {profile.why_join_startup && (
                          <div>
                            <span className="text-sm text-muted-foreground">Why join a startup:</span>
                            <p className="text-white leading-relaxed">{profile.why_join_startup}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  <div>
                    <h3 className="text-lg font-semibold text-accent mb-3">About</h3>
                    <p className="text-muted-foreground leading-relaxed">{profile.short_bio}</p>
                  </div>

                  {/* Looking For */}
                  <div>
                    <h3 className="text-lg font-semibold text-accent mb-3">Looking For</h3>
                    <p className="text-white">{profile.looking_for}</p>
                  </div>

                  {/* View Full Profile Button */}
                  <div className="flex justify-center pt-4 border-t border-accent/10">
                    <Button
                      onClick={() => onViewFullProfile(profile)}
                      className="bg-gradient-to-r from-accent to-accent/80 text-black hover:from-accent/90 hover:to-accent/70 transition-all duration-200 shadow-lg shadow-accent/25"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}