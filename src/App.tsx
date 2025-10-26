import { useState, useEffect } from 'react'
import { HomePage } from './components/HomePage'
import { ProfilePage } from './components/ProfilePage'
import { AdminPanel } from './components/AdminPanel'
import { AdminLogin } from './components/AdminLogin'
import { SupportButton } from './components/SupportButton'
import { supabase } from './lib/supabase'
import { getAutoApprovalSetting } from './lib/settings'
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

  // Check URL for admin route and profile routes
  useEffect(() => {
    const checkRoutes = async () => {
      const path = window.location.pathname
      const hash = window.location.hash
      
      // Check for admin route
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
          console.error('Error fetching profile:', err)
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
          console.error('Error fetching profile:', err)
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
    if (password === 'W9@cZt7!mQ#4rTf%X2^vBp8&') {
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

export default App