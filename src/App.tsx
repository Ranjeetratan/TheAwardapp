import { useState, useEffect } from 'react'
import { HomePage } from './components/HomePage'
import { ProfilePage } from './components/ProfilePage'
import { AdminPanel } from './components/AdminPanel'
import { AdminLogin } from './components/AdminLogin'
import { SupportButton } from './components/SupportButton'
import { AuthProvider } from './contexts/AuthContext'
import { supabase } from './lib/supabase'
import { getAutoApprovalSetting } from './lib/settings'
import type { Profile } from './lib/supabase'

// Global profile cache for better performance
let profileCache: Profile[] = []
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 1000 // 5 seconds for immediate updates

// Function to clear cache (useful for debugging)
const clearProfileCache = () => {
  profileCache = []
  cacheTimestamp = 0
  console.log('Profile cache cleared')
}

// Preload profiles function
const preloadProfiles = async () => {
  const now = Date.now()
  if (profileCache.length > 0 && now - cacheTimestamp < CACHE_DURATION) {
    return profileCache
  }

  try {
    // Check if auto-approval is enabled
    const autoApprovalEnabled = await getAutoApprovalSetting()
    
    let query = supabase
      .from('profiles')
      .select(`
        id, full_name, email, headshot_url, location, linkedin_profile, 
        short_bio, availability, looking_for, role, startup_name, 
        industry, skills_expertise, investment_range, approved, featured, created_at
      `)
    
    // If auto-approval is disabled, only show approved profiles
    if (!autoApprovalEnabled) {
      query = query.eq('approved', true)
    }
    
    const { data, error } = await query
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (!error && data) {
      profileCache = data
      cacheTimestamp = now
    }
  } catch (error) {
    console.error('Error preloading profiles:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })
  }
  
  return profileCache
}

// Export for use in HomePage
export { profileCache, preloadProfiles, clearProfileCache }

function App() {
  const [showProfilePage, setShowProfilePage] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  // Preload profiles on app start for better performance
  useEffect(() => {
    preloadProfiles()
  }, [])

  // Check URL for admin route and profile routes
  useEffect(() => {
    const checkRoutes = async () => {
      const path = window.location.pathname
      const hash = window.location.hash
      
      // Check for admin route - ALWAYS require password
      if (path === '/admin' || hash === '#admin') {
        // Force logout if trying to access admin without proper auth
        const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true'
        const authTimestamp = localStorage.getItem('adminAuthTimestamp')
        const now = Date.now()
        
        // Check if auth is expired (2 hours)
        if (authTimestamp && (now - parseInt(authTimestamp)) > 2 * 60 * 60 * 1000) {
          localStorage.removeItem('adminAuthenticated')
          localStorage.removeItem('adminAuthTimestamp')
          setShowAdminLogin(true)
          setIsAdminAuthenticated(false)
          return
        }
        
        if (isAuthenticated && authTimestamp) {
          setIsAdminAuthenticated(true)
          setShowAdminLogin(false)
        } else {
          localStorage.removeItem('adminAuthenticated')
          localStorage.removeItem('adminAuthTimestamp')
          setShowAdminLogin(true)
          setIsAdminAuthenticated(false)
        }
        return
      }
      
      // Check for profile route
      const profileMatch = path.match(/^\/profile\/(.+)$/)
      if (profileMatch) {
        const profileId = profileMatch[1]
        try {
          // Check if auto-approval is enabled
          const autoApprovalEnabled = await getAutoApprovalSetting()
          
          let query = supabase
            .from('profiles')
            .select('*')
            .eq('id', profileId)
          
          // If auto-approval is disabled, only show approved profiles
          if (!autoApprovalEnabled) {
            query = query.eq('approved', true)
          }
          
          const { data, error } = await query.single()
          
          if (!error && data) {
            setSelectedProfile(data)
            setShowProfilePage(true)
            return
          }
        } catch (err) {
          console.error('Error fetching profile:', {
            message: err instanceof Error ? err.message : 'Unknown error',
            timestamp: new Date().toISOString()
          })
        }
        // If profile not found, redirect to home
        window.history.pushState({}, '', '/')
        return
      }
      
      // Reset states for other routes
      setIsAdminAuthenticated(false)
      setShowAdminLogin(false)
      setShowProfilePage(false)
      setSelectedProfile(null)
    }

    checkRoutes()
  }, [])

  // Listen for navigation changes (back/forward buttons)
  useEffect(() => {
    const handlePopState = async () => {
      const path = window.location.pathname
      const hash = window.location.hash
      
      // Handle admin routes
      if (path === '/admin' || hash === '#admin') {
        const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true'
        
        if (isAuthenticated) {
          setIsAdminAuthenticated(true)
          setShowAdminLogin(false)
        } else {
          setShowAdminLogin(true)
          setIsAdminAuthenticated(false)
        }
        return
      }
      
      // Handle profile routes
      const profileMatch = path.match(/^\/profile\/(.+)$/)
      if (profileMatch) {
        const profileId = profileMatch[1]
        try {
          // Check if auto-approval is enabled
          const autoApprovalEnabled = await getAutoApprovalSetting()
          
          let query = supabase
            .from('profiles')
            .select('*')
            .eq('id', profileId)
          
          // If auto-approval is disabled, only show approved profiles
          if (!autoApprovalEnabled) {
            query = query.eq('approved', true)
          }
          
          const { data, error } = await query.single()
          
          if (!error && data) {
            setSelectedProfile(data)
            setShowProfilePage(true)
            setIsAdminAuthenticated(false)
            setShowAdminLogin(false)
            return
          }
        } catch (err) {
          console.error('Error fetching profile:', {
            message: err instanceof Error ? err.message : 'Unknown error',
            timestamp: new Date().toISOString()
          })
        }
      }
      
      // Reset to homepage
      setIsAdminAuthenticated(false)
      setShowAdminLogin(false)
      setShowProfilePage(false)
      setSelectedProfile(null)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleAdminLogin = (password: string) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'default_password_change_me'
    if (password === adminPassword) {
      localStorage.setItem('adminAuthenticated', 'true')
      localStorage.setItem('adminAuthTimestamp', Date.now().toString())
      setIsAdminAuthenticated(true)
      setShowAdminLogin(false)
      window.location.hash = 'admin'
    } else {
      alert('Invalid password')
    }
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminAuthTimestamp')
    setIsAdminAuthenticated(false)
    setShowAdminLogin(false)
    window.location.hash = ''
    window.location.reload()
  }

  // Additional security: Clear admin session after 2 hours
  useEffect(() => {
    if (isAdminAuthenticated) {
      const timeout = setTimeout(() => {
        handleAdminLogout()
        alert('Admin session expired for security. Please login again.')
      }, 2 * 60 * 60 * 1000) // 2 hours

      return () => clearTimeout(timeout)
    }
  }, [isAdminAuthenticated])

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

function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppWithAuth