import { Logo } from './Logo'
import { useTheme } from '../lib/theme.tsx'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { theme } = useTheme()
  
  return (
    <footer className={`py-12 border-t transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Logo />
            </div>
            <p className={`mb-4 max-w-md ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              The premier platform for founders, cofounders, and investors to connect and build the next generation of startups.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/in/ranjit-kumar-ds/" target="_blank" rel="noopener noreferrer" className={`transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-600 hover:text-emerald-600'}`}>
                LinkedIn
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              <li><a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-emerald-400' : 'hover:text-emerald-600'}`}>Browse Founders</a></li>
              <li><a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-emerald-400' : 'hover:text-emerald-600'}`}>Browse Cofounders</a></li>
              <li><a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-emerald-400' : 'hover:text-emerald-600'}`}>Browse Investors</a></li>
              <li><a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-emerald-400' : 'hover:text-emerald-600'}`}>Submit Profile</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              <li><a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-emerald-400' : 'hover:text-emerald-600'}`}>About</a></li>
              <li><a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-emerald-400' : 'hover:text-emerald-600'}`}>Privacy</a></li>
              <li><a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-emerald-400' : 'hover:text-emerald-600'}`}>Terms</a></li>
              <li><a href="#" className={`transition-colors ${theme === 'dark' ? 'hover:text-emerald-400' : 'hover:text-emerald-600'}`}>Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className={`mt-8 pt-8 text-center text-sm border-t ${theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
          <p>&copy; {currentYear} cofounderBase. Built for indie hackers and makers.</p>
        </div>
      </div>
    </footer>
  )
}