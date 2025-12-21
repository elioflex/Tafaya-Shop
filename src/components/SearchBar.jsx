import React from 'react'
import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange, onClear }) => {
  return (
    <div className="relative max-w-md mx-auto mb-8">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search products..."
        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:border-primary focus:outline-none transition-colors"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBar
