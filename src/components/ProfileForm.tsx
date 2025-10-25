import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { supabase, type Profile } from '../lib/supabase'
import { sendProfileLiveEmail, getFirstName, generateProfileUrl } from '../lib/loop-email'
import { ChevronLeft, ChevronRight, Check, User, Briefcase, FileText, Eye } from 'lucide-react'

interface ProfileFormProps {
  onSuccess?: () => void
}

export function ProfileForm({ onSuccess }: ProfileFormProps = {}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [role, setRole] = useState<'founder' | 'cofounder' | 'investor' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [headshot, setHeadshot] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    location: '',
    linkedin_profile: '',
    website_portfolio: '',
    short_bio: '',
    availability: '',
    timezone: '',
    looking_for: '',
    
    // Founder fields
    startup_name: '',
    startup_stage: '',
    industry: '',
    what_building: '',
    looking_for_cofounder: '',
    
    // Cofounder fields
    skills_expertise: '',
    experience_level: '',
    industry_interests: '',
    past_projects: '',
    why_join_startup: '',
    
    // Investor fields
    investment_range: '',
    investment_stage: '',
    investment_focus: '',
    portfolio_companies: '',
    investment_criteria: ''
  })

  const steps = [
    { number: 1, title: 'Basic Info', icon: User },
    { number: 2, title: 'Role Selection', icon: Briefcase },
    { number: 3, title: 'Details', icon: FileText },
    { number: 4, title: 'Review', icon: Eye }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setHeadshot(file)
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.full_name && formData.email && formData.location && 
                 formData.linkedin_profile && formData.short_bio && formData.availability && 
                 formData.looking_for)
      case 2:
        return !!role
      case 3:
        if (role === 'founder') {
          return !!(formData.startup_name && formData.startup_stage && formData.industry && 
                   formData.what_building && formData.looking_for_cofounder)
        } else if (role === 'cofounder') {
          return !!(formData.skills_expertise && formData.experience_level && formData.why_join_startup)
        } else if (role === 'investor') {
          return !!(formData.investment_range && formData.investment_stage && formData.investment_focus && 
                   formData.investment_criteria)
        }
        return false
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const uploadHeadshot = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      const { error } = await supabase.storage
        .from('headshots')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('headshots')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error uploading headshot:', error)
      return null
    }
  }

  const handleSubmit = async () => {
    if (!role) return

    setIsSubmitting(true)
    
    try {
      let headshotUrl = null
      
      // Try to upload headshot if provided
      if (headshot) {
        try {
          headshotUrl = await uploadHeadshot(headshot)
          if (!headshotUrl) {
            console.warn('Headshot upload failed, continuing without headshot')
          }
        } catch (uploadError) {
          console.warn('Headshot upload error, continuing without headshot:', uploadError)
          // Continue without headshot rather than failing the entire submission
        }
      }

      const profileData: Omit<Profile, 'id' | 'created_at'> = {
        full_name: formData.full_name,
        email: formData.email,
        headshot_url: headshotUrl || undefined,
        location: formData.location,
        linkedin_profile: formData.linkedin_profile,
        website_portfolio: formData.website_portfolio || undefined,
        short_bio: formData.short_bio,
        availability: formData.availability,
        timezone: formData.timezone || undefined,
        looking_for: formData.looking_for,
        role,
        approved: true,
        featured: false,
        ...(role === 'founder' && {
          startup_name: formData.startup_name,
          startup_stage: formData.startup_stage,
          industry: formData.industry,
          what_building: formData.what_building,
          looking_for_cofounder: formData.looking_for_cofounder
        }),
        ...(role === 'cofounder' && {
          skills_expertise: formData.skills_expertise,
          experience_level: formData.experience_level,
          industry_interests: formData.industry_interests || undefined,
          past_projects: formData.past_projects || undefined,
          why_join_startup: formData.why_join_startup
        }),
        ...(role === 'investor' && {
          investment_range: formData.investment_range,
          investment_stage: formData.investment_stage,
          investment_focus: formData.investment_focus,
          portfolio_companies: formData.portfolio_companies || undefined,
          investment_criteria: formData.investment_criteria
        })
      }

      console.log('Submitting profile data:', profileData)

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()

      if (error) {
        console.error('Database error:', error)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log('Profile submitted successfully:', data[0])
      
      // Since profiles are auto-approved, send welcome email immediately
      if (data[0]) {
        try {
          const emailSent = await sendProfileLiveEmail({
            first_name: getFirstName(formData.full_name),
            profile_url: generateProfileUrl(data[0].id),
            full_name: formData.full_name,
            email: formData.email,
            role: role
          })
          
          if (emailSent) {
            console.log('Welcome email sent successfully')
          } else {
            console.log('Welcome email failed to send')
          }
        } catch (emailError) {
          console.error('Email notification error:', emailError)
        }
      }
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`There was an error submitting your profile: ${errorMessage}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-accent/20 shadow-2xl">
              <CardContent className="p-6 sm:p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-accent to-accent/80 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                >
                  <Check className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  Thanks for submitting!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-muted-foreground text-base sm:text-lg mb-6"
                >
                  Your profile is now live and visible in the directory!
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    onClick={onSuccess}
                    className="bg-gradient-to-r from-accent to-accent/80 text-black hover:from-accent/90 hover:to-accent/70 transition-all duration-200"
                  >
                    View Directory
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  placeholder="Your full name"
                  className="transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="headshot">Headshot (Optional)</Label>
              <div className="relative">
                <div className="h-24 border border-input rounded-2xl bg-background hover:border-accent/50 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all duration-200 flex items-center justify-center">
                  <input
                    id="headshot"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="py-3 px-6 rounded-2xl bg-gradient-to-r from-accent to-accent/80 text-black font-semibold text-sm hover:from-accent/90 hover:to-accent/70 transition-all duration-200 shadow-md">
                      Choose File
                    </div>
                    {headshot && (
                      <span className="text-sm text-muted-foreground">
                        {headshot.name}
                      </span>
                    )}
                  </div>
                </div>
                {headshot && (
                  <div className="mt-2 text-sm text-accent">
                    ✓ {headshot.name} selected
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, Country"
                  className="transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin_profile">LinkedIn Profile *</Label>
                <Input
                  id="linkedin_profile"
                  type="url"
                  value={formData.linkedin_profile}
                  onChange={(e) => handleInputChange('linkedin_profile', e.target.value)}
                  placeholder="https://linkedin.com/in/yourname"
                  className="transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_portfolio">Website / Portfolio</Label>
              <Input
                id="website_portfolio"
                type="url"
                value={formData.website_portfolio}
                onChange={(e) => handleInputChange('website_portfolio', e.target.value)}
                placeholder="https://yourwebsite.com"
                className="transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_bio">Short Bio *</Label>
              <Textarea
                id="short_bio"
                value={formData.short_bio}
                onChange={(e) => handleInputChange('short_bio', e.target.value)}
                placeholder="Tell us about yourself and your background..."
                className="min-h-[100px] transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availability">Availability *</Label>
                <select
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => handleInputChange('availability', e.target.value)}
                  className="flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 hover:border-accent/50 focus-visible:ring-accent focus-visible:ring-offset-2 focus:border-accent transition-all duration-200"
                >
                  <option value="">Select availability</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Open to Discuss">Open to Discuss</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  placeholder="e.g., PST, EST, GMT+1"
                  className="transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="looking_for">Looking For *</Label>
              <Input
                id="looking_for"
                value={formData.looking_for}
                onChange={(e) => handleInputChange('looking_for', e.target.value)}
                placeholder="e.g., Tech Co-founder, Marketing Partner"
                className="transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Who are you?</h3>
              <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">Choose your role to customize your profile</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant={role === 'founder' ? 'default' : 'outline'}
                  className={`w-full h-28 sm:h-32 flex flex-col items-center justify-center space-y-2 sm:space-y-3 text-base sm:text-lg transition-all duration-200 ${
                    role === 'founder' 
                      ? 'bg-gradient-to-r from-accent to-accent/80 text-black hover:from-accent/90 hover:to-accent/70 shadow-lg shadow-accent/25' 
                      : 'hover:border-accent hover:bg-accent/5 hover:text-white'
                  }`}
                  onClick={() => setRole('founder')}
                >
                  <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="font-semibold">Founder</span>
                  <span className="text-xs sm:text-sm opacity-80 text-center px-2">I have a startup idea/company</span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant={role === 'cofounder' ? 'default' : 'outline'}
                  className={`w-full h-28 sm:h-32 flex flex-col items-center justify-center space-y-2 sm:space-y-3 text-base sm:text-lg transition-all duration-200 ${
                    role === 'cofounder' 
                      ? 'bg-gradient-to-r from-accent to-accent/80 text-black hover:from-accent/90 hover:to-accent/70 shadow-lg shadow-accent/25' 
                      : 'hover:border-accent hover:bg-accent/5 hover:text-white'
                  }`}
                  onClick={() => setRole('cofounder')}
                >
                  <User className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="font-semibold">Cofounder</span>
                  <span className="text-xs sm:text-sm opacity-80 text-center px-2">I want to join a startup</span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant={role === 'investor' ? 'default' : 'outline'}
                  className={`w-full h-28 sm:h-32 flex flex-col items-center justify-center space-y-2 sm:space-y-3 text-base sm:text-lg transition-all duration-200 ${
                    role === 'investor' 
                      ? 'bg-gradient-to-r from-accent to-accent/80 text-black hover:from-accent/90 hover:to-accent/70 shadow-lg shadow-accent/25' 
                      : 'hover:border-accent hover:bg-accent/5 hover:text-white'
                  }`}
                  onClick={() => setRole('investor')}
                >
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Investor</span>
                  <span className="text-xs sm:text-sm opacity-80 text-center px-2">I want to invest in startups</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {role === 'founder' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="startup_name">Startup Name *</Label>
                  <Input
                    id="startup_name"
                    value={formData.startup_name}
                    onChange={(e) => handleInputChange('startup_name', e.target.value)}
                    placeholder="Your startup name"
                    className="transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startup_stage">Startup Stage *</Label>
                    <select
                      id="startup_stage"
                      value={formData.startup_stage}
                      onChange={(e) => handleInputChange('startup_stage', e.target.value)}
                      className="flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 hover:border-accent/50 focus-visible:ring-accent focus-visible:ring-offset-2 focus:border-accent transition-all duration-200"
                    >
                      <option value="">Select stage</option>
                      <option value="Idea">Idea</option>
                      <option value="MVP">MVP</option>
                      <option value="Pre-Seed">Pre-Seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Scaling">Scaling</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      placeholder="FinTech, HealthTech, etc."
                      className="transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="what_building">What You're Building *</Label>
                  <Textarea
                    id="what_building"
                    value={formData.what_building}
                    onChange={(e) => handleInputChange('what_building', e.target.value)}
                    placeholder="Describe your startup and what problem you're solving..."
                    className="min-h-[100px] transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="looking_for_cofounder">What You're Looking for in a Co-founder *</Label>
                  <Textarea
                    id="looking_for_cofounder"
                    value={formData.looking_for_cofounder}
                    onChange={(e) => handleInputChange('looking_for_cofounder', e.target.value)}
                    placeholder="Describe the skills, experience, and qualities you're looking for..."
                    className="min-h-[100px] transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </>
            )}

            {role === 'cofounder' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="skills_expertise">Skills / Expertise *</Label>
                  <Input
                    id="skills_expertise"
                    value={formData.skills_expertise}
                    onChange={(e) => handleInputChange('skills_expertise', e.target.value)}
                    placeholder="e.g., Full-stack development, Marketing, Sales"
                    className="transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience_level">Experience Level *</Label>
                    <select
                      id="experience_level"
                      value={formData.experience_level}
                      onChange={(e) => handleInputChange('experience_level', e.target.value)}
                      className="flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 hover:border-accent/50 focus-visible:ring-accent focus-visible:ring-offset-2 focus:border-accent transition-all duration-200"
                    >
                      <option value="">Select level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry_interests">Industry Interests</Label>
                    <Input
                      id="industry_interests"
                      value={formData.industry_interests}
                      onChange={(e) => handleInputChange('industry_interests', e.target.value)}
                      placeholder="FinTech, HealthTech, etc."
                      className="transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="past_projects">Past Projects / Portfolio</Label>
                  <Textarea
                    id="past_projects"
                    value={formData.past_projects}
                    onChange={(e) => handleInputChange('past_projects', e.target.value)}
                    placeholder="Describe your relevant projects and achievements..."
                    className="min-h-[100px] transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="why_join_startup">Why You Want to Join a Startup *</Label>
                  <Textarea
                    id="why_join_startup"
                    value={formData.why_join_startup}
                    onChange={(e) => handleInputChange('why_join_startup', e.target.value)}
                    placeholder="Share your motivation and what you hope to achieve..."
                    className="min-h-[100px] transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </>
            )}

            {role === 'investor' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="investment_range">Investment Range *</Label>
                  <select
                    id="investment_range"
                    value={formData.investment_range}
                    onChange={(e) => handleInputChange('investment_range', e.target.value)}
                    className="flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus:border-accent transition-all duration-200"
                  >
                    <option value="">Select investment range</option>
                    <option value="$1K-$10K">$1K-$10K</option>
                    <option value="$10K-$50K">$10K-$50K</option>
                    <option value="$50K-$100K">$50K-$100K</option>
                    <option value="$100K-$500K">$100K-$500K</option>
                    <option value="$500K-$1M">$500K-$1M</option>
                    <option value="$1M-$5M">$1M-$5M</option>
                    <option value="$5M+">$5M+</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investment_stage">Investment Stage *</Label>
                    <select
                      id="investment_stage"
                      value={formData.investment_stage}
                      onChange={(e) => handleInputChange('investment_stage', e.target.value)}
                      className="flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus:border-accent transition-all duration-200"
                    >
                      <option value="">Select stage</option>
                      <option value="Angel">Angel</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B+">Series B+</option>
                      <option value="Strategic">Strategic</option>
                      <option value="Venture Debt">Venture Debt</option>
                      <option value="Syndicate">Syndicate</option>
                      <option value="Family Office">Family Office</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="investment_focus">Investment Focus *</Label>
                    <Input
                      id="investment_focus"
                      value={formData.investment_focus}
                      onChange={(e) => handleInputChange('investment_focus', e.target.value)}
                      placeholder="FinTech, HealthTech, AI/ML, etc."
                      className="transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio_companies">Portfolio Companies</Label>
                  <Textarea
                    id="portfolio_companies"
                    value={formData.portfolio_companies}
                    onChange={(e) => handleInputChange('portfolio_companies', e.target.value)}
                    placeholder="List some of your portfolio companies or investment experience..."
                    className="min-h-[100px] transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investment_criteria">Investment Criteria *</Label>
                  <Textarea
                    id="investment_criteria"
                    value={formData.investment_criteria}
                    onChange={(e) => handleInputChange('investment_criteria', e.target.value)}
                    placeholder="What do you look for in startups? Team, market size, traction, etc..."
                    className="min-h-[100px] transition-all duration-200 hover:border-accent/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </>
            )}
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Review Your Profile</h3>
              <p className="text-muted-foreground text-sm sm:text-base">Please review your information before submitting</p>
            </div>

            <div className="space-y-6">
              <div className="bg-card/30 rounded-2xl p-4 sm:p-6 border border-border/50">
                <h4 className="font-semibold text-accent mb-3 sm:mb-4 text-sm sm:text-base">Basic Information</h4>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="break-words"><span className="text-muted-foreground">Name:</span> {formData.full_name}</div>
                      <div className="break-words"><span className="text-muted-foreground">Email:</span> {formData.email}</div>
                      <div className="break-words"><span className="text-muted-foreground">Location:</span> {formData.location}</div>
                      <div className="break-words"><span className="text-muted-foreground">Availability:</span> {formData.availability}</div>
                      <div className="break-words"><span className="text-muted-foreground">Looking For:</span> {formData.looking_for}</div>
                      <div className="break-words"><span className="text-muted-foreground">Role:</span> {role}</div>
                      {formData.website_portfolio && (
                        <div className="sm:col-span-2 break-all"><span className="text-muted-foreground">Website:</span> {formData.website_portfolio}</div>
                      )}
                      {formData.timezone && (
                        <div className="break-words"><span className="text-muted-foreground">Timezone:</span> {formData.timezone}</div>
                      )}
                    </div>
                    {formData.short_bio && (
                      <div className="mt-3 sm:mt-4">
                        <div className="text-muted-foreground text-xs sm:text-sm mb-2">Bio:</div>
                        <p className="text-xs sm:text-sm leading-relaxed">{formData.short_bio}</p>
                      </div>
                    )}
                  </div>
                  {headshot && (
                    <div className="flex-shrink-0 self-start">
                      <div className="text-muted-foreground text-xs sm:text-sm mb-2">Headshot:</div>
                      <img
                        src={URL.createObjectURL(headshot)}
                        alt="Profile headshot"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-accent/20 mx-auto sm:mx-0"
                      />
                    </div>
                  )}
                </div>
              </div>

              {role === 'founder' && (
                <div className="bg-card/30 rounded-2xl p-4 sm:p-6 border border-border/50">
                  <h4 className="font-semibold text-accent mb-3 sm:mb-4 text-sm sm:text-base">Startup Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="break-words"><span className="text-muted-foreground">Startup:</span> {formData.startup_name}</div>
                    <div className="break-words"><span className="text-muted-foreground">Stage:</span> {formData.startup_stage}</div>
                    <div className="break-words"><span className="text-muted-foreground">Industry:</span> {formData.industry}</div>
                  </div>
                </div>
              )}

              {role === 'cofounder' && (
                <div className="bg-card/30 rounded-2xl p-4 sm:p-6 border border-border/50">
                  <h4 className="font-semibold text-accent mb-3 sm:mb-4 text-sm sm:text-base">Skills & Experience</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="break-words"><span className="text-muted-foreground">Skills:</span> {formData.skills_expertise}</div>
                    <div className="break-words"><span className="text-muted-foreground">Experience:</span> {formData.experience_level}</div>
                    {formData.industry_interests && (
                      <div className="break-words"><span className="text-muted-foreground">Interests:</span> {formData.industry_interests}</div>
                    )}
                  </div>
                </div>
              )}

              {role === 'investor' && (
                <div className="bg-card/30 rounded-2xl p-4 sm:p-6 border border-border/50">
                  <h4 className="font-semibold text-accent mb-3 sm:mb-4 text-sm sm:text-base">Investment Profile</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div className="break-words"><span className="text-muted-foreground">Range:</span> {formData.investment_range}</div>
                    <div className="break-words"><span className="text-muted-foreground">Stage:</span> {formData.investment_stage}</div>
                    <div className="break-words"><span className="text-muted-foreground">Focus:</span> {formData.investment_focus}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <section id="join-form" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-accent/20 shadow-2xl hover:shadow-accent/20 hover:border-accent/40 transition-all duration-300">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Join the Base
              </CardTitle>
              
              {/* Step Indicator */}
              <div className="flex justify-center mt-6 sm:mt-8 px-2">
                <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
                  {steps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = currentStep === step.number
                    const isCompleted = currentStep > step.number
                    
                    return (
                      <div key={step.number} className="flex items-center flex-shrink-0">
                        <motion.div
                          className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300 ${
                            isCompleted
                              ? 'bg-accent border-accent text-black'
                              : isActive
                              ? 'border-accent text-accent bg-accent/10'
                              : 'border-muted-foreground/30 text-muted-foreground'
                          }`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                          ) : (
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </motion.div>
                        
                        <div className="ml-2 sm:ml-3 hidden md:block">
                          <div className={`text-xs sm:text-sm font-medium ${isActive ? 'text-accent' : 'text-muted-foreground'}`}>
                            {step.title}
                          </div>
                        </div>
                        
                        {index < steps.length - 1 && (
                          <div className={`w-4 sm:w-8 h-0.5 mx-2 sm:mx-4 ${isCompleted ? 'bg-accent' : 'bg-muted-foreground/30'}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Mobile Step Title */}
              <div className="block md:hidden text-center mt-4">
                <div className="text-sm font-medium text-accent">
                  Step {currentStep}: {steps[currentStep - 1]?.title}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>
              
              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center justify-center space-x-2 hover:border-accent hover:text-accent transition-all duration-200 w-full sm:w-auto order-2 sm:order-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-accent to-accent/80 text-black hover:from-accent/90 hover:to-accent/70 transition-all duration-200 w-full sm:w-auto order-1 sm:order-2"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-accent to-accent/80 text-black hover:from-accent/90 hover:to-accent/70 transition-all duration-200 w-full sm:w-auto order-1 sm:order-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Profile</span>
                        <Check className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}