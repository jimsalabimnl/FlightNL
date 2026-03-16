import { Search, Settings } from 'lucide-react'
import { useState } from 'react'

export default function TopBar({ onSearch, flightCount }) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e) => {
    const value = e.target.value.toUpperCase()
    setSearchValue(value)
    onSearch?.(value)
  }

  return (
    <div className="absolute top-6 left-6 right-6 z-10 flex gap-4 items-center">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <div className="glass-panel px-4 py-3 rounded-xl flex items-center gap-2">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search flight (callsign, ICAO)..."
            value={searchValue}
            onChange={handleSearch}
            className="flex-1 bg-transparent text-white outline-none placeholder-slate-500 text-sm"
          />
        </div>
      </div>

      {/* Settings Button */}
      <button className="glass-panel p-3 rounded-xl hover:bg-slate-800 transition-colors">
        <Settings size={18} className="text-slate-400" />
      </button>

      {/* Flight Counter */}
      <div className="glass-panel px-4 py-3 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-slate-200">
            {flightCount} vluchten
          </span>
        </div>
      </div>
    </div>
  )
}
