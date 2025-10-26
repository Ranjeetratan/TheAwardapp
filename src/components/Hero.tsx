import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchBar } from './SearchBar'

interface HeroProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  activeTab: 'founders' | 'cofounders' | 'investors'
  onSubmitProfile: () => void
}

export function Hero({ searchQuery, onSearchChange, activeTab, onSubmitProfile }: HeroProps) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const roles = ['Founders', 'Cofounders', 'Investors']
  
  // Animate role text every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center relative">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto w-full"
      >
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <div className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent mb-6">
              Find your perfect
            </div>
            <div className="h-20 sm:h-24 md:h-28 lg:h-32 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoleIndex}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.8 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="bg-gradient-to-r from-accent via-accent/90 to-accent/80 bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-none"
                >
                  {roles[currentRoleIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </h1>
        </motion.div>

        {/* Hero Search Bar - Will become sticky */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
          id="hero-search"
        >
          <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-xl rounded-2xl border border-accent/20 p-4">
            <SearchBar
              value={searchQuery}
              onChange={onSearchChange}
              placeholder={`Search ${activeTab}...`}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSubmitProfile}
            className="px-8 py-4 bg-gradient-to-r from-accent to-accent/80 text-black font-semibold rounded-2xl hover:from-accent/90 hover:to-accent/70 transition-all duration-200 shadow-lg shadow-accent/25 text-lg"
          >
            Get Started Today
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('directory')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 border-2 border-accent/30 text-accent font-semibold rounded-2xl hover:bg-accent/10 transition-all duration-200 text-lg"
          >
            Browse Profiles
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}