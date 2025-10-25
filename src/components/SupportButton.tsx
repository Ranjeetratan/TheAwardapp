import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export function SupportButton() {
  const handleSupportClick = () => {
    window.open('https://www.linkedin.com/in/ranjeet-ratan-59a221203/', '_blank')
  }

  return (
    <motion.button
      onClick={handleSupportClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-accent to-accent/80 rounded-full shadow-lg shadow-accent/25 flex items-center justify-center hover:scale-110 transition-all duration-200 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5, type: "spring" }}
    >
      <MessageCircle className="w-6 h-6 text-black group-hover:animate-pulse" />
      
      {/* Tooltip */}
      <div className="absolute bottom-16 right-0 bg-background/90 backdrop-blur-sm border border-accent/20 rounded-lg px-3 py-2 text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Need help? Contact support
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background/90"></div>
      </div>
    </motion.button>
  )
}