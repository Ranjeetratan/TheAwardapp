import { motion } from 'framer-motion'

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center space-x-2"
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
            <path
              d="M8 16C8 12.6863 10.6863 10 14 10C17.3137 10 20 12.6863 20 16"
              stroke="#f1fb48"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M24 16C24 19.3137 21.3137 22 18 22C14.6863 22 12 19.3137 12 16"
              stroke="#f1fb48"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="14" cy="16" r="2" fill="#f1fb48" />
            <circle cx="18" cy="16" r="2" fill="#f1fb48" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}