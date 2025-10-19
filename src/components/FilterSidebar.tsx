import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { X, ChevronDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FilterSidebarProps {
  activeTab: 'founders' | 'cofounders' | 'investors'
  filters: {
    location: string[]
    industry: string[]
    availability: string[]
    stage: string[]
    experience: string[]
    investmentRange: string[]
    investmentType: string[]
    skills: string[]
    lookingFor: string[]
    companySize: string[]
    fundingStage: string[]
  }
  onFilterChange: (filterType: string, value: string) => void
  onClearFilters: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function FilterSidebar({ activeTab, filters, onFilterChange, onClearFilters, isCollapsed, onToggleCollapse }: FilterSidebarProps) {
  const [openDropdowns, setOpenDropdowns] = useState<string[]>(['location', 'skills'])

  const filterOptions = {
    location: ['San Francisco', 'New York', 'London', 'Berlin', 'Remote', 'Los Angeles', 'Austin', 'Seattle', 'Toronto', 'Amsterdam', 'Boston', 'Chicago', 'Miami', 'Denver', 'Portland'],
    industry: ['FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML', 'SaaS', 'Gaming', 'Climate Tech', 'Crypto/Web3', 'DeepTech', 'Marketplace', 'Social Media', 'Enterprise Software', 'Consumer Apps', 'Hardware'],
    availability: ['Full-time', 'Part-time', 'Open to Discuss', 'Consulting', 'Equity Only', 'Sweat Equity', 'Paid Role'],
    stage: ['Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Scaling', 'Product-Market Fit'],
    experience: ['Beginner (0-2 years)', 'Intermediate (3-5 years)', 'Senior (6-10 years)', 'Expert (10+ years)', 'Serial Entrepreneur'],
    investmentRange: ['$1K-$10K', '$10K-$50K', '$50K-$100K', '$100K-$500K', '$500K-$1M', '$1M-$5M', '$5M+'],
    investmentType: ['Angel', 'Seed', 'Series A', 'Series B+', 'Strategic', 'Venture Debt', 'Syndicate', 'Family Office'],
    skills: ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Mobile Development', 'iOS', 'Android', 'Flutter', 'React Native', 'No-Code', 'Bubble', 'Webflow', 'Figma', 'UI/UX Design', 'Product Management', 'DevOps', 'AWS', 'Machine Learning', 'Data Science', 'Blockchain', 'Solidity', 'Go', 'Rust', 'Java', 'C++', 'PHP', 'Ruby', 'Vue.js', 'Angular', 'Next.js', 'Django', 'Flask', 'Express.js'],
    lookingFor: ['Technical Cofounder', 'Business Cofounder', 'CTO', 'VP Engineering', 'Lead Developer', 'Product Manager', 'Designer', 'Marketing Partner', 'Sales Partner', 'Operations Partner'],
    companySize: ['Solo Founder', '2-3 People', '4-10 People', '11-50 People', '50+ People'],
    fundingStage: ['Bootstrapped', 'Pre-Revenue', 'Revenue Generating', 'Profitable', 'Seeking Investment', 'Recently Funded']
  }

  const hasActiveFilters = Object.values(filters).some(filterArray => filterArray.length > 0)

  const toggleDropdown = (filterType: string) => {
    setOpenDropdowns(prev => 
      prev.includes(filterType) 
        ? prev.filter(item => item !== filterType)
        : [...prev, filterType]
    )
  }

  const getRelevantFilters = () => {
    const baseFilters = ['location', 'industry', 'availability']
    
    if (activeTab === 'founders') {
      return [...baseFilters, 'stage', 'lookingFor', 'companySize', 'fundingStage']
    } else if (activeTab === 'cofounders') {
      return [...baseFilters, 'skills', 'experience', 'lookingFor']
    } else if (activeTab === 'investors') {
      return [...baseFilters, 'investmentRange', 'investmentType', 'stage']
    }
    
    return baseFilters
  }

  const getFilterLabel = (filterType: string) => {
    const labels = {
      location: 'Location',
      industry: 'Industry',
      availability: 'Availability',
      stage: 'Startup Stage',
      experience: 'Experience Level',
      investmentRange: 'Investment Range',
      investmentType: 'Investment Type',
      skills: 'Skills & Tech Stack',
      lookingFor: 'Looking For',
      companySize: 'Company Size',
      fundingStage: 'Funding Stage'
    }
    return labels[filterType as keyof typeof labels] || filterType
  }

  return (
    <div className="relative">
      {/* Collapse Toggle Button */}
      <div className="relative group">
        <Button
          onClick={onToggleCollapse}
          className={`${isCollapsed ? 'relative' : 'absolute -right-12 top-4'} z-50 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-accent/20 hover:bg-accent/10 p-0 shadow-lg transition-all duration-200`}
          variant="ghost"
        >
          {isCollapsed ? (
            <div className="flex flex-col items-center">
              <Filter className="w-5 h-5 text-accent mb-1" />
              <ChevronRight className="w-3 h-3 text-accent" />
            </div>
          ) : (
            <ChevronLeft className="w-4 h-4 text-accent" />
          )}
        </Button>
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-background/90 backdrop-blur-sm border border-accent/20 rounded-lg px-3 py-2 text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Open Advanced Filters
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-background/90"></div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            <div className="w-80">
              <Card className="bg-card/50 backdrop-blur-xl border border-accent/20 shadow-lg max-h-full overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Filter className="w-5 h-5 text-accent" />
                      <CardTitle className="text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Advanced Filters
                      </CardTitle>
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-accent hover:text-accent/80 text-xs font-medium"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
        <CardContent className="space-y-6 overflow-y-auto max-h-96">
          {getRelevantFilters().map((filterType) => (
            <div key={filterType}>
              <button
                onClick={() => toggleDropdown(filterType)}
                className="w-full flex items-center justify-between text-sm font-medium mb-3 text-gray-300 hover:text-white transition-colors"
              >
                <span>{getFilterLabel(filterType)}</span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openDropdowns.includes(filterType) ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {openDropdowns.includes(filterType) && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filterOptions[filterType as keyof typeof filterOptions]?.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-accent/5 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters[filterType as keyof typeof filters]?.includes(option) || false}
                        onChange={() => onFilterChange(filterType, option)}
                        className="rounded border-accent/20 text-accent focus:ring-accent/20 bg-background/50"
                      />
                      <span className="text-sm text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {/* Show selected filters as badges */}
              {filters[filterType as keyof typeof filters]?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {filters[filterType as keyof typeof filters]?.map((selectedOption) => (
                    <Badge
                      key={selectedOption}
                      variant="default"
                      className="bg-accent text-black hover:bg-accent/90 text-xs cursor-pointer"
                      onClick={() => onFilterChange(filterType, selectedOption)}
                    >
                      {selectedOption}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Quick Filters */}
          <div className="border-t border-accent/10 pt-4">
            <Label className="text-sm font-medium mb-3 block text-gray-300">Quick Filters</Label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-accent/5 p-2 rounded-lg transition-colors">
                <input type="checkbox" className="rounded border-accent/20 text-accent focus:ring-accent/20 bg-background/50" />
                <span className="text-sm text-gray-300">Featured profiles</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-accent/5 p-2 rounded-lg transition-colors">
                <input type="checkbox" className="rounded border-accent/20 text-accent focus:ring-accent/20 bg-background/50" />
                <span className="text-sm text-gray-300">Recently joined</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-accent/5 p-2 rounded-lg transition-colors">
                <input type="checkbox" className="rounded border-accent/20 text-accent focus:ring-accent/20 bg-background/50" />
                <span className="text-sm text-gray-300">Has portfolio</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer hover:bg-accent/5 p-2 rounded-lg transition-colors">
                <input type="checkbox" className="rounded border-accent/20 text-accent focus:ring-accent/20 bg-background/50" />
                <span className="text-sm text-gray-300">Verified profiles</span>
              </label>
            </div>
          </div>
        </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}