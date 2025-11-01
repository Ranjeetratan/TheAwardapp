import { motion, useReducedMotion } from 'framer-motion'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '../lib/theme.tsx'

interface HeaderProps {
  onSubmitProfile: () => void
  onLogoClick?: () => void
}

export function Header({ onSubmitProfile, onLogoClick }: HeaderProps) {
  const { theme } = useTheme()
  const prefersReducedMotion = useReducedMotion()

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950/95 border-slate-800' : 'bg-slate-50/95 border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={!prefersReducedMotion ? { scale: 1.02 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="cursor-pointer"
            onClick={onLogoClick}
          >
            <Logo />
          </motion.div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Button
              onClick={onSubmitProfile}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25"
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit Profile
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}