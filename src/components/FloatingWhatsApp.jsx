import React from 'react'
import { MessageCircle } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations/translations'

const FloatingWhatsApp = () => {
  const { language } = useLanguage()
  
  const openWhatsApp = () => {
    const phone = '212684048574'
    const message = encodeURIComponent(t('whatsappGreeting', language))
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  return (
    <button
      onClick={openWhatsApp}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 animate-bounce"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </button>
  )
}

export default FloatingWhatsApp
