import { motion, useReducedMotion } from 'framer-motion'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { MapPin, Briefcase, User, Star } from 'lucide-react'
import type { Profile } from '../lib/supabase'
import { useTheme } from '../lib/theme.tsx'

interface ProfileCardProps {
  profile: Profile
  onClick: () => void
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  const { theme } = useTheme()
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      whileHover={!prefersReducedMotion ? { y: -4, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className={`transition-all duration-300 group overflow-hidden ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 hover:bg-slate-800/50' : 'bg-white border-slate-200 hover:border-emerald-500/30 hover:shadow-lg'}`}>
        <CardContent className="p-0">
          {/* Profile Image */}
          <div className="relative aspect-[4/3]">
            {profile.headshot_url ? (
              <img
                src={profile.headshot_url}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br flex items-center justify-center border-2 border-dashed ${theme === 'dark' ? 'from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20' : 'from-emerald-500/5 via-emerald-500/3 to-transparent border-emerald-500/15'}`}>
                {profile.role === 'founder' ? (
                  <Briefcase className="w-8 h-8 text-accent" />
                ) : (
                  <User className="w-8 h-8 text-accent" />
                )}
              </div>
            )}
            {profile.featured && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-black" />
              </div>
            )}
            <div className="absolute top-2 left-2">
              <Badge 
                variant="secondary"
                className={`${
                  profile.role === 'founder' 
                    ? 'bg-blue-600/90 text-white border-blue-600 shadow-lg backdrop-blur-sm' 
                    : profile.role === 'cofounder'
                    ? 'bg-green-600/90 text-white border-green-600 shadow-lg backdrop-blur-sm'
                    : 'bg-purple-600/90 text-white border-purple-600 shadow-lg backdrop-blur-sm'
                } capitalize text-xs font-medium px-2 py-1`}
              >
                {profile.role}
              </Badge>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-3">
            <h3 className={`font-bold mb-1 transition-colors duration-300 truncate text-sm tracking-tight ${theme === 'dark' ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-600'}`}>
              {profile.full_name}
            </h3>
            
            <div className={`flex items-center text-xs mb-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{profile.location}</span>
            </div>

            {/* Role-specific info */}
            {profile.role === 'founder' && profile.startup_name && (
              <p className={`text-xs font-medium mb-1 truncate ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{profile.startup_name}</p>
            )}

            {profile.role === 'cofounder' && profile.skills_expertise && (
              <p className={`text-xs mb-1 truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {profile.skills_expertise.split(',')[0].trim()}
                {profile.skills_expertise.split(',').length > 1 && '...'}
              </p>
            )}

            {profile.role === 'investor' && (
              <div className="mb-1">
                {profile.investment_range && (
                  <p className={`text-xs font-medium truncate ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{profile.investment_range}</p>
                )}
                {profile.portfolio_companies && (
                  <p className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {profile.portfolio_companies.split(',')[0].trim()}
                    {profile.portfolio_companies.split(',').length > 1 && '...'}
                  </p>
                )}
              </div>
            )}

            {/* Bio */}
            <p className={`text-xs line-clamp-2 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {profile.short_bio}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}