import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Eye, Heart } from 'lucide-react'

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const openWhatsApp = (e) => {
    e.preventDefault()
    const phone = '212684048574'
    const message = encodeURIComponent(`Hello! I'm interested in ${product.name}`)
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          setIsFavorite(!isFavorite)
        }}
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
      >
        <Heart
          className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Badge */}
      <div className="absolute top-3 left-3 z-10 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
        Handmade
      </div>

      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className="aspect-square bg-gray-200 overflow-hidden relative">
          <img
            src={product.image || 'https://via.placeholder.com/400x400?text=Tafaya+Ashtray'}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=Tafaya+Ashtray'
            }}
          />

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Link
              to={`/product/${product.id}`}
              className="bg-white text-primary px-4 py-2 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
            {product.name}
          </h4>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            {product.price && (
              <p className="text-2xl font-bold text-primary">
                {product.price} <span className="text-sm">MAD</span>
              </p>
            )}
            <button
              onClick={openWhatsApp}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              Order
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
