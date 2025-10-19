import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { Logo } from './Logo'

interface AdminLoginProps {
  onLogin: (password: string) => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    onLogin(password)
    setIsLoading(false)
  }

  const handleBackToHome = () => {
    window.history.pushState({}, '', '/')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#1a1a1a] text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <button onClick={handleBackToHome} className="hover:opacity-80 transition-opacity">
            <Logo />
          </button>
        </div>

        <Card className="bg-card/50 backdrop-blur-xl border-accent/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Admin Access</CardTitle>
            <p className="text-muted-foreground">Enter your password to access the admin panel</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="pr-12 bg-background/50 border-accent/20 focus:border-accent focus:ring-2 focus:ring-accent/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !password}
                className="w-full bg-gradient-to-r from-accent to-accent/80 text-black hover:from-accent/90 hover:to-accent/70 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  'Access Admin Panel'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleBackToHome}
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                ← Back to Homepage
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}