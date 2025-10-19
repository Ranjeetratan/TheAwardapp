import { motion } from 'framer-motion'

export function ComingSoon() {
  const features = [
    {
      icon: '🔐',
      title: 'User Accounts & Authentication',
      description: 'Secure login, profile management, and personalized dashboard for tracking connections.',
      status: 'In Development',
      color: 'accent',
      priority: 1
    },
    {
      icon: '💬',
      title: 'Direct Messaging System',
      description: 'Built-in chat for seamless communication between founders, cofounders, and investors.',
      status: 'Coming Soon',
      color: 'blue',
      priority: 2
    },
    {
      icon: '🎯',
      title: 'Smart Matching Algorithm',
      description: 'AI-powered recommendations based on skills, industry, and startup stage compatibility.',
      status: 'Planning',
      color: 'purple',
      priority: 3
    },
    {
      icon: '⭐',
      title: 'Featured Profiles & Premium',
      description: 'Premium visibility options and verified badges for enhanced profile credibility.',
      status: 'Beta Testing',
      color: 'green',
      priority: 4
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Track profile views, connection requests, and engagement metrics for optimization.',
      status: 'Planned',
      color: 'orange',
      priority: 5
    },
    {
      icon: '🎓',
      title: 'Founder Resources Hub',
      description: 'Pitch deck templates, cofounder agreements, and startup building resources.',
      status: 'Research Phase',
      color: 'pink',
      priority: 6
    }
  ]

  const getStatusColor = (color: string) => {
    const colors = {
      accent: 'from-accent/20 to-accent/5 border-accent/30 text-accent',
      blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
      purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
      green: 'from-green-500/20 to-green-500/5 border-green-500/30 text-green-400',
      orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/30 text-orange-400',
      pink: 'from-pink-500/20 to-pink-500/5 border-pink-500/30 text-pink-400'
    }
    return colors[color as keyof typeof colors] || colors.accent
  }

  const getIconBg = (color: string) => {
    const colors = {
      accent: 'bg-accent/20',
      blue: 'bg-blue-500/20',
      purple: 'bg-purple-500/20',
      green: 'bg-green-500/20',
      orange: 'bg-orange-500/20',
      pink: 'bg-pink-500/20'
    }
    return colors[color as keyof typeof colors] || colors.accent
  }

  const getStatusBadge = (_status: string, color: string) => {
    const badgeColors = {
      accent: 'bg-accent/20 text-accent',
      blue: 'bg-blue-500/20 text-blue-400',
      purple: 'bg-purple-500/20 text-purple-400',
      green: 'bg-green-500/20 text-green-400',
      orange: 'bg-orange-500/20 text-orange-400',
      pink: 'bg-pink-500/20 text-pink-400'
    }
    return badgeColors[color as keyof typeof badgeColors] || badgeColors.accent
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-card/10 border-t border-accent/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            What's Coming Next
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            We're building the most comprehensive platform for startup team formation. Here's our roadmap.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`bg-gradient-to-br ${getStatusColor(feature.color)} border rounded-2xl p-6 text-center backdrop-blur-sm relative overflow-hidden`}
            >
              {/* Priority Badge */}
              <div className="absolute top-3 right-3 w-6 h-6 bg-background/50 rounded-full flex items-center justify-center text-xs font-bold text-accent">
                {feature.priority}
              </div>
              
              <div className={`w-12 h-12 ${getIconBg(feature.color)} rounded-xl flex items-center justify-center mx-auto mb-4 text-xl`}>
                {feature.icon}
              </div>
              
              <h3 className={`text-lg font-semibold mb-2 ${feature.color === 'accent' ? 'text-accent' : `text-${feature.color}-400`}`}>
                {feature.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              <div className={`inline-block px-3 py-1 ${getStatusBadge(feature.status, feature.color)} rounded-full text-xs font-medium`}>
                {feature.status}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Want to influence our roadmap or get early access?
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-black font-semibold rounded-2xl hover:from-accent/90 hover:to-accent/70 transition-all duration-200 shadow-lg shadow-accent/25">
            Join Our Community
          </button>
        </motion.div>
      </div>
    </section>
  )
}