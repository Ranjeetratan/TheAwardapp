import { motion } from 'framer-motion'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { MapPin, Briefcase, User, Star } from 'lucide-react'
import type { Profile } from '../lib/supabase'

interface ProfileCardProps {
  profile: Profile
  onClick: () => void
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="bg-white/5 border-white/10 hover:border-accent/40 transition-all duration-300 group overflow-hidden">
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
              <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
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
            <h3 className="font-semibold text-white mb-1 group-hover:text-accent transition-colors duration-300 truncate text-sm">
              {profile.full_name}
            </h3>
            
            <div className="flex items-center text-xs text-gray-400 mb-2">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="truncate">{profile.location}</span>
            </div>

            {/* Role-specific info */}
            {profile.role === 'founder' && profile.startup_name && (
              <p className="text-xs text-accent font-medium mb-1 truncate">{profile.startup_name}</p>
            )}

            {profile.role === 'cofounder' && profile.skills_expertise && (
              <p className="text-xs text-gray-400 mb-1 truncate">
                {profile.skills_expertise.split(',')[0].trim()}
                {profile.skills_expertise.split(',').length > 1 && '...'}
              </p>
            )}

            {profile.role === 'investor' && (
              <div className="mb-1">
                {profile.investment_range && (
                  <p className="text-xs text-accent font-medium truncate">{profile.investment_range}</p>
                )}
                {profile.portfolio_companies && (
                  <p className="text-xs text-gray-400 truncate">
                    {profile.portfolio_companies.split(',')[0].trim()}
                    {profile.portfolio_companies.split(',').length > 1 && '...'}
                  </p>
                )}
              </div>
            )}

            {/* Bio */}
            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {profile.short_bio}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}