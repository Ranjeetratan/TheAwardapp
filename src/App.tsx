import { useState, useEffect } from 'react'
import { HomePage } from './components/HomePage'
import { ProfilePage } from './components/ProfilePage'
import { AdminPanel } from './components/AdminPanel'
import { AdminLogin } from './components/AdminLogin'
import { SupportButton } from './components/SupportButton'
import { supabase } from './lib/supabase'
import type { Profile } from './lib/supabase'

// Global profile cache for better performance
let profileCache: Profile[] = []
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Preload profiles function
const preloadProfiles = async () => {
  const now = Date.now()
  if (profileCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
    return profileCache
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, full_name, email, headshot_url, location, linkedin_profile, 
        short_bio, availability, looking_for, role, startup_name, 
        industry, skills_expertise, investment_range, approved, featured, created_at
      `)
      .eq('approved', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error && data) {
      profileCache = data
      cacheTimestamp = now
    }
  } catch (error) {
    console.error('Error preloading profiles:', error)
  }
  
  return profileCache
}

// Export for use in HomePage
export { profileCache, preloadProfiles }

function App() {
  const [showProfilePage, setShowProfilePage] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  // Preload profiles on app start for better performance
  useEffect(() => {
    preloadProfiles()
  }, [])

  // Check URL for admin route
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname
      const hash = window.location.hash
      
      if (path === '/admin' || hash === '#admin') {
        const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true'
        
        if (isAuthenticated) {
          setIsAdminAuthenticated(true)
          setShowAdminLogin(false)
        } else {
          setShowAdminLogin(true)
          setIsAdminAuthenticated(false)
        }
      } else {
        // Reset admin states when not on admin route
        setIsAdminAuthenticated(false)
        setShowAdminLogin(false)
      }
    }

    checkAdminRoute()
  }, [])

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      
      if (hash === '#admin') {
        const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true'
        
        if (isAuthenticated) {
          setIsAdminAuthenticated(true)
          setShowAdminLogin(false)
        } else {
          setShowAdminLogin(true)
          setIsAdminAuthenticated(false)
        }
      } else {
        // Reset admin states when hash is not admin
        setIsAdminAuthenticated(false)
        setShowAdminLogin(false)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const handleAdminLogin = (password: string) => {
    if (password === 'De@dp00l') {
      localStorage.setItem('adminAuthenticated', 'true')
      setIsAdminAuthenticated(true)
      setShowAdminLogin(false)
      window.location.hash = 'admin'
    } else {
      alert('Invalid password')
    }
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    setIsAdminAuthenticated(false)
    setShowAdminLogin(false)
    window.location.hash = ''
    window.location.reload()
  }

  const handleBackFromProfile = () => {
    setShowProfilePage(false)
    setSelectedProfile(null)
  }

  // Admin Login
  if (showAdminLogin) {
    return <AdminLogin onLogin={handleAdminLogin} />
  }

  // Admin Panel
  if (isAdminAuthenticated) {
    return (
      <>
        <AdminPanel onLogout={handleAdminLogout} />
        <SupportButton />
      </>
    )
  }

  // Profile Page
  if (showProfilePage && selectedProfile) {
    return (
      <>
        <ProfilePage 
          profile={selectedProfile}
          onBack={handleBackFromProfile}
        />
        <SupportButton />
      </>
    )
  }

  // Main Homepage
  return (
    <>
      <HomePage />
      <SupportButton />
    </>
  )
}

export default App