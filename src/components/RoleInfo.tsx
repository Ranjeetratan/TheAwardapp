import { motion } from 'framer-motion'
import { Briefcase, Code, DollarSign } from 'lucide-react'

interface RoleInfoProps {
  activeTab: 'founders' | 'cofounders' | 'investors' | 'all'
}

export function RoleInfo({ activeTab }: RoleInfoProps) {
  // If showing all roles, display overview cards
  if (activeTab === 'all') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Founders Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 rounded-2xl p-6 text-center backdrop-blur-sm"
        >
          <Briefcase className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-blue-400 mb-2">Founders</h3>
          <p className="text-muted-foreground mb-4">Entrepreneurs building startups</p>
          <div className="space-y-2 text-sm">
            <div className="text-accent font-semibold">500+ Active Founders</div>
            <div className="text-muted-foreground">15+ Industries</div>
            <div className="text-muted-foreground">Idea to Series B+</div>
          </div>
        </motion.div>

        {/* Cofounders Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-2xl p-6 text-center backdrop-blur-sm"
        >
          <Code className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-400 mb-2">Cofounders</h3>
          <p className="text-muted-foreground mb-4">Skilled professionals ready to join</p>
          <div className="space-y-2 text-sm">
            <div className="text-accent font-semibold">300+ Available</div>
            <div className="text-muted-foreground">25+ Tech Stacks</div>
            <div className="text-muted-foreground">All Experience Levels</div>
          </div>
        </motion.div>

        {/* Investors Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 text-center backdrop-blur-sm"
        >
          <DollarSign className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-yellow-400 mb-2">Investors</h3>
          <p className="text-muted-foreground mb-4">Angels and VCs funding startups</p>
          <div className="space-y-2 text-sm">
            <div className="text-accent font-semibold">150+ Active</div>
            <div className="text-muted-foreground">$1K - $5M+ Range</div>
            <div className="text-muted-foreground">1000+ Portfolio</div>
          </div>
        </motion.div>
      </div>
    )
  }

  const roleData = {
    founders: {
      icon: <Briefcase className="w-8 h-8 text-blue-400" />,
      title: 'Founders',
      description: 'Entrepreneurs building the next generation of startups',
      stats: [
        { label: 'Active Founders', value: '500+' },
        { label: 'Industries', value: '15+' },
        { label: 'Startup Stages', value: 'Idea to Series B+' }
      ],
      features: [
        'Find technical cofounders and CTOs',
        'Connect with business partners',
        'Access to verified profiles',
        'Filter by startup stage and industry',
        'Direct LinkedIn connections'
      ],
      searchPlaceholder: 'Search founders by company, industry, or stage...'
    },
    cofounders: {
      icon: <Code className="w-8 h-8 text-green-400" />,
      title: 'Cofounders',
      description: 'Skilled professionals ready to join founding teams',
      stats: [
        { label: 'Available Cofounders', value: '300+' },
        { label: 'Tech Stacks', value: '25+' },
        { label: 'Experience Levels', value: 'All Levels' }
      ],
      features: [
        'Browse by technical skills (React, Python, etc.)',
        'Filter by experience level',
        'Equity and paid opportunities',
        'Portfolio and project history',
        'Remote and local options'
      ],
      searchPlaceholder: 'Search cofounders by skills, experience, or location...'
    },
    investors: {
      icon: <DollarSign className="w-8 h-8 text-yellow-400" />,
      title: 'Investors',
      description: 'Angel investors and VCs funding early-stage startups',
      stats: [
        { label: 'Active Investors', value: '150+' },
        { label: 'Investment Range', value: '$1K - $5M+' },
        { label: 'Portfolio Companies', value: '1000+' }
      ],
      features: [
        'Angel investors and seed funds',
        'Filter by investment range and stage',
        'Industry-specific investors',
        'Portfolio company insights',
        'Direct contact information'
      ],
      searchPlaceholder: 'Search investors by focus, range, or portfolio...'
    }
  }

  const currentRole = roleData[activeTab]

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm border border-accent/20 rounded-2xl p-6 mb-8"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            {currentRole.icon}
            <div>
              <h2 className="text-2xl font-bold text-white">{currentRole.title}</h2>
              <p className="text-muted-foreground">{currentRole.description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {currentRole.stats.map((stat, index) => (
              <div key={index} className="text-center sm:text-left">
                <div className="text-xl font-bold text-accent">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-80">
          <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
          <ul className="space-y-2">
            {currentRole.features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}