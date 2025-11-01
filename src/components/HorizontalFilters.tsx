import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { ChevronDown, X, Filter } from 'lucide-react'

interface HorizontalFiltersProps {
  activeTab: 'founders' | 'cofounders' | 'investors' | 'all'
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
}

export function HorizontalFilters({ activeTab, filters, onFilterChange, onClearFilters }: HorizontalFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  // Memoize filter options to prevent unnecessary re-renders
  const filterOptions = {
    location: ['San Francisco', 'New York', 'London', 'Berlin', 'Remote', 'Los Angeles', 'Austin', 'Seattle', 'Toronto', 'Amsterdam'],
    industry: ['FinTech', 'HealthTech', 'EdTech', 'E-commerce', 'AI/ML', 'SaaS', 'Gaming', 'Climate Tech', 'Crypto/Web3', 'DeepTech'],
    availability: ['Full-time', 'Part-time', 'Open to Discuss', 'Consulting', 'Equity Only'],
    stage: ['Idea', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Series B+', 'Scaling'],
    experience: ['Beginner', 'Intermediate', 'Senior', 'Expert'],
    investmentRange: ['$1K-$10K', '$10K-$50K', '$50K-$100K', '$100K-$500K', '$500K-$1M', '$1M+'],
    investmentType: ['Angel', 'Seed', 'Series A', 'Series B+', 'Strategic', 'Venture Debt'],
    skills: ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Mobile Development', 'UI/UX Design', 'Product Management', 'DevOps', 'Machine Learning'],
    lookingFor: ['Technical Cofounder', 'Business Cofounder', 'CTO', 'VP Engineering', 'Product Manager', 'Designer'],
    companySize: ['Solo Founder', '2-3 People', '4-10 People', '11-50 People', '50+ People'],
    fundingStage: ['Bootstrapped', 'Pre-Revenue', 'Revenue Generating', 'Profitable', 'Seeking Investment']
  }

  const getRelevantFilters = () => {
    const baseFilters = ['location', 'industry', 'availability']
    
    if (activeTab === 'founders') {
      return [...baseFilters, 'stage', 'lookingFor', 'companySize', 'fundingStage']
    } else if (activeTab === 'cofounders') {
      return [...baseFilters, 'skills', 'experience', 'lookingFor']
    } else if (activeTab === 'investors') {
      return [...baseFilters, 'investmentRange', 'investmentType', 'stage']
    } else if (activeTab === 'all') {
      return [...baseFilters, 'stage', 'skills', 'experience', 'lookingFor']
    }
    
    return baseFilters
  }

  const getFilterLabel = (filterType: string) => {
    const labels = {
      location: 'Location',
      industry: 'Industry',
      availability: 'Availability',
      stage: 'Stage',
      experience: 'Experience',
      investmentRange: 'Investment Range',
      investmentType: 'Investment Type',
      skills: 'Skills',
      lookingFor: 'Looking For',
      companySize: 'Company Size',
      fundingStage: 'Funding Stage'
    }
    return labels[filterType as keyof typeof labels] || filterType
  }

  const hasActiveFilters = Object.values(filters).some(filterArray => filterArray.length > 0)

  const toggleDropdown = (filterType: string) => {
    setOpenDropdown(openDropdown === filterType ? null : filterType)
  }

  return (
    <div ref={containerRef}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Filter className="w-4 h-4 text-accent" />
            <span>Filters:</span>
          </div>
          
          {getRelevantFilters().map((filterType) => (
            <div key={filterType} className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleDropdown(filterType)}
                className={`flex items-center space-x-2 border-accent/20 hover:border-accent/40 ${
                  filters[filterType as keyof typeof filters]?.length > 0 
                    ? 'bg-accent/10 border-accent/40 text-accent' 
                    : 'hover:bg-accent/5 hover:text-accent'
                }`}
              >
                <span>{getFilterLabel(filterType)}</span>
                {filters[filterType as keyof typeof filters]?.length > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-accent text-black">
                    {filters[filterType as keyof typeof filters]?.length}
                  </Badge>
                )}
                <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === filterType ? 'rotate-180' : ''}`} />
              </Button>

              {openDropdown === filterType && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-background/95 backdrop-blur-xl border border-accent/20 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto"
                >
                  <div className="p-3 space-y-2">
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
                </motion.div>
              )}
            </div>
          ))}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-accent hover:text-accent/80 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Selected Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(filters).map(([filterType, selectedOptions]) =>
              selectedOptions.map((option) => (
                <Badge
                  key={`${filterType}-${option}`}
                  variant="default"
                  className="bg-accent/20 text-accent hover:bg-accent/30 cursor-pointer"
                  onClick={() => onFilterChange(filterType, option)}
                >
                  {option}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))
            )}
          </div>
        )}
    </div>
  )
}