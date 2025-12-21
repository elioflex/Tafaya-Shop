import React, { useState } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const LanguageToggle = () => {
  const { language, changeLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇲🇦' }
  ]

  const currentLang = languages.find(lang => lang.code === language)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray-50 border-2 border-gray-200 transition-all shadow-sm hover:shadow-md"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="hidden sm:inline font-medium text-gray-700">{currentLang?.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  language === lang.code ? 'bg-amber-50 border-l-4 border-primary' : ''
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className={`font-medium ${language === lang.code ? 'text-primary' : 'text-gray-700'}`}>
                  {lang.name}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageToggle
