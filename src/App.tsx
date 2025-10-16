import { Hero } from './components/Hero'
import { About } from './components/About'
import { ProfileForm } from './components/ProfileForm'
import { Footer } from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#1a1a1a] text-white">
      <Hero />
      <About />
      <ProfileForm />
      <Footer />
    </div>
  )
}

export default App
