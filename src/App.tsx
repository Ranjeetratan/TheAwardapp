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
    const path = window.location.pathname
    if (path === '/admin') {
      const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true'
      if (isAuthenticated) {
        setIsAdminAuthenticated(true)
      } else {
        setShowAdminLogin(true)
      }
    }
  }, [])

  const handleAdminLogin = (password: string) => {
    if (password === 'De@dp00l') {
      setIsAdminAuthenticated(true)
      setShowAdminLogin(false)
      localStorage.setItem('adminAuthenticated', 'true')
      window.history.pushState({}, '', '/admin')
    } else {
      alert('Invalid password')
    }
  }

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false)
    localStorage.removeItem('adminAuthenticated')
    window.history.pushState({}, '', '/')
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