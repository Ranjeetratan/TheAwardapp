import { useState, useEffect } from 'react'
import { HomePage } from './components/HomePage'
import { ProfilePage } from './components/ProfilePage'
import { AdminPanel } from './components/AdminPanel'
import { AdminLogin } from './components/AdminLogin'
import { SupportButton } from './components/SupportButton'
import type { Profile } from './lib/supabase'

function App() {
  const [showProfilePage, setShowProfilePage] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  // Check URL for admin route
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname
      const hash = window.location.hash
      console.log('Checking admin route:', { path, hash })
      
      if (path === '/admin' || hash === '#admin') {
        const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true'
        console.log('Admin route detected, authenticated:', isAuthenticated)
        
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
      console.log('Hash changed to:', hash)
      
      if (hash === '#admin') {
        const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true'
        console.log('Admin hash detected, authenticated:', isAuthenticated)
        
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
    console.log('Admin login attempt with password:', password)
    if (password === 'De@dp00l') {
      console.log('Password correct, logging in...')
      localStorage.setItem('adminAuthenticated', 'true')
      setIsAdminAuthenticated(true)
      setShowAdminLogin(false)
      window.location.hash = 'admin'
    } else {
      console.log('Invalid password')
      alert('Invalid password')
    }
  }

  const handleAdminLogout = () => {
    console.log('Admin logout')
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

  console.log('App render state:', {
    showAdminLogin,
    isAdminAuthenticated,
    showProfilePage,
    selectedProfile: !!selectedProfile
  })

  // Admin Login
  if (showAdminLogin) {
    console.log('Rendering AdminLogin')
    return <AdminLogin onLogin={handleAdminLogin} />
  }

  // Admin Panel
  if (isAdminAuthenticated) {
    console.log('Rendering AdminPanel')
    return (
      <>
        <AdminPanel onLogout={handleAdminLogout} />
        <SupportButton />
      </>
    )
  }

  // Profile Page
  if (showProfilePage && selectedProfile) {
    console.log('Rendering ProfilePage')
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
  console.log('Rendering HomePage')
  return (
    <>
      <HomePage />
      <SupportButton />
    </>
  )
}

export default App