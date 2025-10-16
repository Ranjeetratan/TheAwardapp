import { motion } from 'framer-motion'
import { Card, CardContent } from './ui/card'

export function About() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
        >
          <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-accent/20 shadow-2xl hover:shadow-accent/20 hover:border-accent/40 transition-all duration-300 group">
            <CardContent className="p-8">
              <motion.h2 
                className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-accent group-hover:to-accent/80 transition-all duration-300"
                whileInView={{ scale: [0.9, 1] }}
                transition={{ duration: 0.5 }}
              >
                The Problem We're Solving
              </motion.h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center group-hover:text-gray-200 transition-colors duration-300">
                Reddit is flooded with "looking for co-founder" posts that get lost in the noise. 
                Traditional networking feels forced and inefficient. We're building a dedicated space 
                where serious founders and talented individuals can connect authentically.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
        >
          <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-accent/20 shadow-2xl hover:shadow-accent/20 hover:border-accent/40 transition-all duration-300 group">
            <CardContent className="p-8">
              <motion.h2 
                className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-accent group-hover:to-accent/80 transition-all duration-300"
                whileInView={{ scale: [0.9, 1] }}
                transition={{ duration: 0.5 }}
              >
                Our Solution
              </motion.h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center group-hover:text-gray-200 transition-colors duration-300">
                CofounderBase is a curated platform designed specifically for founder-cofounder matching. 
                No endless scrolling, no spam posts — just quality profiles from people ready to build 
                the next big thing together.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}