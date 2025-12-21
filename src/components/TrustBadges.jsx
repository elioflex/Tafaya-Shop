import React from 'react'
import { Shield, Award, Truck, Heart } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations/translations'

const TrustBadges = () => {
  const { language } = useLanguage()
  
  const badges = [
    {
      icon: Heart,
      title: t('handmadeTitle', language),
      description: t('handmadeDesc', language)
    },
    {
      icon: Award,
      title: t('qualityTitle', language),
      description: t('qualityDesc', language)
    },
    {
      icon: Shield,
      title: t('guaranteeTitle', language),
      description: t('guaranteeDesc', language)
    },
    {
      icon: Truck,
      title: t('deliveryTitle', language),
      description: t('deliveryDesc', language)
    }
  ]

  return (
    <section className="py-12 bg-dark-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-dark-800 border border-gold-600 border-opacity-20 hover:border-opacity-50 transition-all"
            >
              <badge.icon className="w-12 h-12 text-gold-400 mb-3" />
              <h3 className="font-semibold text-white mb-1">{badge.title}</h3>
              <p className="text-sm text-gray-400">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBadges
