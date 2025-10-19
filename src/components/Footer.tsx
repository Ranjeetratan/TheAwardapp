import { Logo } from './Logo'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-card/30 border-t border-accent/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              The premier platform for founders, cofounders, and investors to connect and build the next generation of startups.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                GitHub
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">Browse Founders</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Browse Cofounders</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Browse Investors</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Submit Profile</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-accent/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} cofounderBase. Built for the startup community.</p>
        </div>
      </div>
    </footer>
  )
}