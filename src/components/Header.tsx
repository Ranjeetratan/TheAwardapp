import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { Logo } from './Logo'

interface HeaderProps {
  onSubmitProfile: () => void
  onLogoClick?: () => void
}

export function Header({ onSubmitProfile, onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={onLogoClick}
          >
            <Logo />
          </motion.div>

          {/* Submit Profile Button */}
          <Button
            onClick={onSubmitProfile}
            className="bg-accent hover:bg-accent/90 text-black font-medium px-6 py-2.5 rounded-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Submit Profile
          </Button>
        </div>
      </div>
    </header>
  )
}