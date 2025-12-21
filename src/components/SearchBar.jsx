import React from 'react'
import { Search } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations/translations'

const SearchBar = ({ value, onChange, onClear }) => {
  const { language } = useLanguage()
  
  return (
    <div className="relative max-w-md mx-auto mb-8">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('searchProducts', language)}
        className="w-full pl-12 pr-4 py-3 bg-dark-800 border-2 border-gold-600 border-opacity-20 rounded-full focus:ring-2 focus:ring-gold-600 focus:border-gold-600 text-white placeholder-gray-500"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gold-400 text-xl"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBar
