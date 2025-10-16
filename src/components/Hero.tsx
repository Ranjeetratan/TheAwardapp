import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative bg-gradient-to-br from-transparent via-accent/5 to-transparent">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >

        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent"
        >
          CofounderBase
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Find your cofounder or join a startup — simple, fast, and founder-focused.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-accent to-accent/80 text-black font-semibold rounded-2xl hover:from-accent/90 hover:to-accent/70 transition-all duration-200 shadow-lg shadow-accent/25"
          >
            Get Started
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}