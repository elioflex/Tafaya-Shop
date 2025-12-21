import React from 'react'
import { Star, Quote } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations/translations'

const Testimonials = () => {
  const { language } = useLanguage()
  
  const testimonials = [
    {
      name: 'Ahmed M.',
      location: t('casablanca', language),
      rating: 5,
      text: t('testimonial1', language),
      image: 'https://ui-avatars.com/api/?name=Ahmed+M&background=d97706&color=fff'
    },
    {
      name: 'Fatima Z.',
      location: t('marrakech', language),
      rating: 5,
      text: t('testimonial2', language),
      image: 'https://ui-avatars.com/api/?name=Fatima+Z&background=b45309&color=fff'
    },
    {
      name: 'Youssef K.',
      location: t('rabat', language),
      rating: 5,
      text: t('testimonial3', language),
      image: 'https://ui-avatars.com/api/?name=Youssef+K&background=fbbf24&color=000'
    }
  ]

  return (
    <section className="py-20 bg-dark-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            {t('customersSay', language)}
          </h2>
          <div className="w-24 h-1 bg-gold-gradient mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 font-light">
            {t('joinCustomers', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-dark-800 border border-gold-600 border-opacity-20 rounded-xl shadow-2xl p-8 hover:border-opacity-50 transition-all relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-gold-600 opacity-20" />
              
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4 border-2 border-gold-600"
                />
                <div>
                  <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-300 italic leading-relaxed">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
