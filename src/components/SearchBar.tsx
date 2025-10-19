import { Search } from 'lucide-react'
import { Input } from './ui/input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = "Search profiles..." }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 h-14 text-base bg-white/5 border-white/10 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 rounded-xl text-white placeholder:text-gray-400"
      />
    </div>
  )
}