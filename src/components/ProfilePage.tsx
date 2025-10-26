import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { ArrowLeft, MapPin, Clock, Briefcase, User, Star, Globe, Calendar, Plus, Share2 } from 'lucide-react'
import type { Profile } from '../lib/supabase'

interface ProfilePageProps {
  profile: Profile
  onBack: () => void
}

export function ProfilePage({ profile, onBack }: ProfilePageProps) {
  const handleShareProfile = async () => {
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
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Profile link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#1a1a1a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-accent hover:text-accent/80 hover:bg-accent/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Button>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleShareProfile}
                className="border-accent/30 text-accent hover:bg-accent/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
              <Button
                onClick={() => {
                  const event = new CustomEvent('openProfileForm')
                  window.dispatchEvent(event)
                }}
                className="bg-gradient-to-r from-accent to-accent/80 text-black hover:from-accent/90 hover:to-accent/70 transition-all duration-200 shadow-lg shadow-accent/25"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Header */}
          <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-accent/20 shadow-lg mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                {/* Profile Image */}
                <div className="relative flex-shrink-0 mx-auto lg:mx-0">
                  {profile.headshot_url ? (
                    <img
                      src={profile.headshot_url}
                      alt={profile.full_name}
                      className="w-40 h-40 rounded-3xl object-cover border-4 border-accent/20 shadow-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center border-4 border-accent/20 shadow-lg">
                      {profile.role === 'founder' ? (
                        <Briefcase className="w-20 h-20 text-accent" />
                      ) : (
                        <User className="w-20 h-20 text-accent" />
                      )}
                    </div>
                  )}
                  {profile.featured && (
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-6 h-6 text-black" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                    <div className="mb-4 lg:mb-0">
                      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
                        {profile.full_name}
                      </h1>
                      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-5 h-5" />
                          <span className="text-base">{profile.location}</span>
                        </div>
                        {profile.timezone && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-5 h-5" />
                            <span className="text-base">{profile.timezone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-5 h-5" />
                          <span className="text-base">Joined {new Date(profile.created_at || '').toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        profile.role === 'founder' 
                          ? 'border-blue-500/50 text-blue-400' 
                          : profile.role === 'cofounder'
                          ? 'border-green-500/50 text-green-400'
                          : 'border-yellow-500/50 text-yellow-400'
                      } capitalize text-xl px-6 py-3 mx-auto lg:mx-0`}
                    >
                      {profile.role}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                    <Badge variant="secondary" className="bg-accent/20 text-accent px-6 py-3 text-base">
                      {profile.availability}
                    </Badge>
                    {profile.featured && (
                      <Badge className="bg-gradient-to-r from-accent to-accent/80 text-black px-6 py-3 text-base">
                        ⭐ Featured Profile
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <Button
                      onClick={() => window.open(profile.linkedin_profile, '_blank')}
                      className="bg-[#0077B5] hover:bg-[#005885] text-white flex items-center gap-2 px-6 py-3 text-base"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </Button>

                    <Button
                      onClick={handleShareProfile}
                      className="bg-accent hover:bg-accent/90 text-black flex items-center gap-2 px-6 py-3 text-base"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Share Profile
                    </Button>
                    {profile.website_portfolio && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(profile.website_portfolio!, '_blank')}
                        className="border-accent/30 text-accent hover:bg-accent/10 px-6 py-3 text-base"
                      >
                        <Globe className="w-5 h-5 mr-2" />
                        Portfolio
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-accent mb-4">About</h2>
                  <div className="bg-background/30 rounded-lg p-4">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {profile.short_bio}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Role-specific Information */}
              {profile.role === 'founder' && (
                <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-accent mb-4">Startup Information</h2>
                    <div className="space-y-6">
                      {profile.startup_name && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">Company</h3>
                          <p className="text-muted-foreground text-lg">{profile.startup_name}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile.startup_stage && (
                          <div className="bg-background/30 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Stage</h3>
                            <Badge variant="outline" className="text-base px-3 py-1">
                              {profile.startup_stage}
                            </Badge>
                          </div>
                        )}
                        {profile.industry && (
                          <div className="bg-background/30 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Industry</h3>
                            <Badge variant="outline" className="text-base px-3 py-1">
                              {profile.industry}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {profile.what_building && (
                        <div className="bg-background/30 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-3">What We're Building</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {profile.what_building}
                          </p>
                        </div>
                      )}

                      {profile.looking_for_cofounder && (
                        <div className="bg-background/30 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-3">Looking For</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {profile.looking_for_cofounder}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {profile.role === 'cofounder' && (
                <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-accent mb-4">Skills & Experience</h2>
                    <div className="space-y-6">
                      {profile.skills_expertise && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">Technical Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.skills_expertise.split(',').map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-base px-3 py-1">
                                {skill.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile.experience_level && (
                          <div className="bg-background/30 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Experience Level</h3>
                            <Badge variant="outline" className="text-base px-3 py-1">
                              {profile.experience_level}
                            </Badge>
                          </div>
                        )}
                        {profile.industry_interests && (
                          <div className="bg-background/30 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Industry Interests</h3>
                            <p className="text-muted-foreground">{profile.industry_interests}</p>
                          </div>
                        )}
                      </div>

                      {profile.past_projects && (
                        <div className="bg-background/30 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-3">Past Projects</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {profile.past_projects}
                          </p>
                        </div>
                      )}

                      {profile.why_join_startup && (
                        <div className="bg-background/30 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-3">Why Join a Startup</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {profile.why_join_startup}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {profile.role === 'investor' && (
                <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold text-accent mb-4">Investment Profile</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile.investment_range && (
                          <div className="bg-background/30 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Investment Range</h3>
                            <Badge variant="outline" className="text-base px-3 py-1 bg-green-500/20 text-green-400 border-green-500/50">
                              {profile.investment_range}
                            </Badge>
                          </div>
                        )}
                        {profile.investment_stage && (
                          <div className="bg-background/30 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-white mb-2">Investment Stage</h3>
                            <Badge variant="outline" className="text-base px-3 py-1">
                              {profile.investment_stage}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {profile.investment_focus && (
                        <div className="bg-background/30 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-2">Investment Focus</h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.investment_focus.split(',').map((focus, index) => (
                              <Badge key={index} variant="outline" className="text-base px-3 py-1">
                                {focus.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {profile.portfolio_companies && (
                        <div className="bg-background/30 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-3">Portfolio Companies</h3>
                          <div className="flex flex-wrap gap-2">
                            {profile.portfolio_companies.split(',').map((company, index) => (
                              <Badge key={index} variant="secondary" className="text-sm px-3 py-1 bg-accent/20 text-accent">
                                {company.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {profile.investment_criteria && (
                        <div className="bg-background/30 rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-white mb-3">Investment Criteria</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {profile.investment_criteria}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Info */}
              <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-accent mb-4">Quick Info</h3>
                  <div className="space-y-4">
                    <div className="bg-background/30 rounded-lg p-3">
                      <span className="text-sm text-muted-foreground block mb-1">Looking For:</span>
                      <p className="text-white font-medium text-sm leading-relaxed">{profile.looking_for}</p>
                    </div>
                    <div className="bg-background/30 rounded-lg p-3">
                      <span className="text-sm text-muted-foreground block mb-1">Availability:</span>
                      <p className="text-white font-medium">{profile.availability}</p>
                    </div>
                    {profile.timezone && (
                      <div className="bg-background/30 rounded-lg p-3">
                        <span className="text-sm text-muted-foreground block mb-1">Timezone:</span>
                        <p className="text-white font-medium">{profile.timezone}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Advertisement Card */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Looking to build your MVP?</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    $1000 for the planning, Miro Board and the MVP. Get your startup idea validated and built by experts.
                  </p>
                  <Button
                    onClick={() => window.open('https://www.linkedin.com/in/ranjit-kumar-ds/', '_blank')}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              {/* More Suggested Profiles */}
              <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-accent mb-4">More Suggested Profiles</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Sarah Chen</p>
                        <p className="text-xs text-muted-foreground">AI/ML Engineer</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Mike Rodriguez</p>
                        <p className="text-xs text-muted-foreground">FinTech Founder</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-background/30 rounded-lg hover:bg-background/50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Alex Kim</p>
                        <p className="text-xs text-muted-foreground">Product Designer</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-accent/30 text-accent hover:bg-accent/10"
                    onClick={onBack}
                  >
                    View All Profiles
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-accent/20 bg-card/30 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">CofounderBase</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Connecting ambitious founders and talented cofounders to build the future together.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-accent transition-colors">About</a>
              <a href="#" className="hover:text-accent transition-colors">Privacy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms</a>
              <a href="#" className="hover:text-accent transition-colors">Contact</a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              © 2024 CofounderBase. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}