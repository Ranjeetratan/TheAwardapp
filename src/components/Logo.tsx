import { motion } from 'framer-motion'
import { useTheme } from '../lib/theme.tsx'

export function Logo() {
  const { theme } = useTheme()
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-3"
    >
      <div className="relative">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981"/>
                <stop offset="100%" stopColor="#059669"/>
              </linearGradient>
            </defs>
            <circle cx="10" cy="12" r="3" fill="url(#logoGradient)" opacity="0.9"/>
            <circle cx="22" cy="12" r="3" fill="url(#logoGradient)" opacity="0.9"/>
            <circle cx="16" cy="22" r="3" fill="url(#logoGradient)" opacity="0.9"/>
            <path d="M13 12L19 12" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 14L14.5 20" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M20 14L17.5 20" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="1.5" fill="url(#logoGradient)"/>
          </svg>
        </div>
      </div>
      <span className={`text-xl font-light tracking-wide ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
        cofounder<span className="font-bold">Base</span>
      </span>
    </motion.div>
  )
}