import React from 'react'
import { Shield, Award, Truck, Heart } from 'lucide-react'

const TrustBadges = () => {
  const badges = [
    {
      icon: Heart,
      title: '100% Handmade',
      description: 'Crafted with passion'
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Best materials'
    },
    {
      icon: Shield,
      title: 'Satisfaction Guaranteed',
      description: 'Or money back'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Across Morocco'
    }
  ]

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-amber-50 transition-colors"
            >
              <badge.icon className="w-12 h-12 text-primary mb-3" />
              <h3 className="font-semibold text-gray-800 mb-1">{badge.title}</h3>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBadges
