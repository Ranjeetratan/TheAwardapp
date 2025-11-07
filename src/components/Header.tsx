import { motion, useReducedMotion } from 'framer-motion'
import { Button } from './ui/button'
import { Plus, LogOut, User as UserIcon } from 'lucide-react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '../lib/theme.tsx'
import { useAuth } from '../contexts/AuthContext'

interface HeaderProps {
  onSubmitProfile: () => void
  onLogoClick?: () => void
}

export function Header({ onSubmitProfile, onLogoClick }: HeaderProps) {
  const { theme } = useTheme()
  const { user, signOut } = useAuth()
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
            
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <UserIcon className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-emerald-500 font-medium">{user.email}</span>
                </div>
                <Button
                  onClick={onSubmitProfile}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Profile
                </Button>
                <Button
                  onClick={() => signOut()}
                  variant="outline"
                  className="border-red-500/50 text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={onSubmitProfile}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}