import React from 'react'
import { Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Ahmed M.',
      location: 'Casablanca',
      rating: 5,
      text: 'Amazing quality! The ashtray is beautiful and exactly what I wanted. Highly recommend!',
      image: 'https://ui-avatars.com/api/?name=Ahmed+M&background=8B4513&color=fff'
    },
    {
      name: 'Fatima Z.',
      location: 'Marrakech',
      rating: 5,
      text: 'Perfect gift for my husband. The craftsmanship is incredible. Will order again!',
      image: 'https://ui-avatars.com/api/?name=Fatima+Z&background=D2691E&color=fff'
    },
    {
      name: 'Youssef K.',
      location: 'Rabat',
      rating: 5,
      text: 'Custom design came out perfect. Great communication and fast delivery!',
      image: 'https://ui-avatars.com/api/?name=Youssef+K&background=CD853F&color=fff'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600">
            Join hundreds of satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-amber-200" />
              
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-gray-600 italic">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
