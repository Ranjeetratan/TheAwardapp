import { motion } from 'framer-motion'
import { Code, Zap, DollarSign, Users } from 'lucide-react'

export function IndieStats() {
  const stats = [
    { icon: Code, label: 'Solo Developers', value: '2.5K+', color: 'text-blue-400' },
    { icon: Zap, label: 'SaaS Builders', value: '1.8K+', color: 'text-purple-400' },
    { icon: DollarSign, label: 'Revenue Generated', value: '$12M+', color: 'text-green-400' },
    { icon: Users, label: 'Successful Teams', value: '450+', color: 'text-accent' }
  ]

  return (
    <section className="py-16 px-6 lg:px-8 border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Trusted by Indie Makers Worldwide
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join a community of builders creating profitable products and sustainable businesses
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}