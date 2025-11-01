import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { useTheme } from '../lib/theme.tsx'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Search profiles..." }: SearchBarProps) {
  const { theme } = useTheme()
  
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-400' : 'text-slate-500'}`} />
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pl-12 h-14 text-base focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 rounded-xl ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-400' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'}`}
      />
    </div>
  )
}