import { motion } from 'framer-motion'
import { Card, CardContent } from './ui/card'
import { 
  Users, MessageCircle, Calendar, Search, Shield, Zap, 
  CheckCircle, Clock, ArrowRight, Sparkles
} from 'lucide-react'

export function WhatsNext() {
  const roadmapItems = [
    {
      title: "User Login & Profiles",
      description: "Secure authentication system with personalized dashboards for founders and co-founders",
      icon: Shield,
      status: "in-progress",
      timeline: "Q1 2026",
      features: ["Secure authentication", "Personal dashboards", "Profile management", "Privacy controls"]
    },
    {
      title: "Direct Messaging",
      description: "Chat directly with founders and co-founders without leaving the platform",
      icon: MessageCircle,
      status: "planned",
      timeline: "Q2 2026",
      features: ["Real-time messaging", "File sharing", "Message history", "Notification system"]
    },
    {
      title: "Calendar Integration",
      description: "Schedule meetings and show availability directly on your profile",
      icon: Calendar,
      status: "planned",
      timeline: "Q2 2026",
      features: ["Availability display", "Meeting scheduling", "Calendar sync", "Time zone support"]
    },
    {
      title: "Advanced Matching",
      description: "AI-powered matching system to find the perfect co-founder based on skills and goals",
      icon: Search,
      status: "planned",
      timeline: "Q3 2026",
      features: ["Smart recommendations", "Compatibility scoring", "Skill matching", "Goal alignment"]
    },
    {
      title: "Team Building Tools",
      description: "Collaborative tools for building and managing your founding team",
      icon: Users,
      status: "planned",
      timeline: "Q3 2026",
      features: ["Team workspaces", "Task management", "Document sharing", "Progress tracking"]
    },
    {
      title: "Startup Resources",
      description: "Curated resources, templates, and tools to help you build your startup",
      icon: Sparkles,
      status: "planned",
      timeline: "Q4 2026",
      features: ["Startup templates", "Legal documents", "Funding guides", "Expert mentorship"]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/20'
      case 'in-progress':
        return 'text-accent bg-accent/20'
      case 'planned':
        return 'text-blue-400 bg-blue-400/20'
      default:
        return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle
      case 'in-progress':
        return Zap
      case 'planned':
        return Clock
      default:
        return Clock
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-card/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            What's Next?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We're constantly evolving to make finding your perfect co-founder even easier. 
            Here's what we're building next to revolutionize how founders connect and collaborate.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {roadmapItems.map((item, index) => {
            const StatusIcon = getStatusIcon(item.status)
            const ItemIcon = item.icon
            
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-card/30 backdrop-blur-sm border-accent/10 hover:border-accent/30 transition-all duration-300 h-full group hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent/80 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <ItemIcon className="w-6 h-6 text-black" />
                      </div>
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="capitalize">{item.status.replace('-', ' ')}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 text-sm text-accent mb-3">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{item.timeline}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {item.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-300">
                            <ArrowRight className="w-3 h-3 text-accent" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-accent/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Have Ideas or Feedback?
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              We're building this platform for you! Share your thoughts, suggestions, or feature requests 
              to help us create the best co-founder matching experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.open('mailto:ranjit.kumar.ds@gmail.com?subject=Feature Request - CofounderBase', '_blank')}
                className="px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-black font-semibold rounded-lg hover:from-accent/90 hover:to-accent/70 transition-all duration-200"
              >
                Share Your Ideas
              </button>
              <button
                onClick={() => window.open('https://www.linkedin.com/in/ranjit-kumar-ds/', '_blank')}
                className="px-6 py-3 border border-accent/30 text-accent font-semibold rounded-lg hover:bg-accent/10 transition-all duration-200"
              >
                Connect with Founder
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}