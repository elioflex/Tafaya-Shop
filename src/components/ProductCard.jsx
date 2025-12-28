import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Eye, Heart, Package } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations/translations'
import { socialLinks } from '../siteConfig'

const ProductCard = ({ product }) => {
  const { language } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const isOutOfStock = product.stock !== null && product.stock !== undefined && product.stock <= 0
  const isLowStock = product.stock !== null && product.stock !== undefined && product.stock > 0 && product.stock <= 3

  const openWhatsApp = (e) => {
    e.preventDefault()
    if (isOutOfStock) return
    const phone = socialLinks.whatsapp
    const message = encodeURIComponent(`${t('whatsappInterested', language)} ${product.name}`)
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  return (
    <div
      className="bg-dark-800 border border-gold-600 border-opacity-20 rounded-xl shadow-2xl overflow-hidden hover:shadow-[0_0_30px_rgba(217,119,6,0.3)] hover:border-opacity-50 transition-all duration-300 transform hover:-translate-y-2 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          setIsFavorite(!isFavorite)
        }}
        className="absolute top-3 right-3 z-10 bg-dark-900 rounded-full p-2 shadow-lg hover:scale-110 transition-transform border border-gold-600 border-opacity-30"
      >
        <Heart
          className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
        />
      </button>

      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isOutOfStock ? (
          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {language === 'fr' ? 'Épuisé' : language === 'ar' ? 'نفذ' : 'Out of Stock'}
          </div>
        ) : (
          <div className="bg-gold-gradient text-dark-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {t('handmadeBadge', language)}
          </div>
        )}
        {isLowStock && (
          <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            {language === 'fr' ? `Plus que ${product.stock}!` : language === 'ar' ? `${product.stock} فقط!` : `Only ${product.stock} left!`}
          </div>
        )}
      </div>

      <Link to={`/product/${product.id}`} className="block">
        {/* Image Container */}
        <div className={`aspect-square bg-dark-900 overflow-hidden relative ${isOutOfStock ? 'opacity-60' : ''}`}>
          <img
            src={product.image || 'https://via.placeholder.com/400x400?text=Tafaya+Ashtray'}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'
              }`}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x400?text=Tafaya+Ashtray'
            }}
          />

          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <Link
              to={`/product/${product.id}`}
              className="bg-gold-gradient text-dark-900 px-6 py-3 rounded-full font-bold hover:shadow-2xl transition-all flex items-center gap-2 uppercase tracking-wider"
            >
              <Eye className="w-4 h-4" />
              {t('viewDetails', language)}
            </Link>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5">
          <h4 className="text-lg font-bold text-white mb-2 line-clamp-1">
            {product.name}
          </h4>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              {product.price && (
                <p className="text-2xl font-bold gold-shine">
                  {product.price} <span className="text-sm">MAD</span>
                </p>
              )}
              {product.views > 0 && (
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <Eye className="w-3 h-3" /> {product.views} {language === 'fr' ? 'vues' : 'views'}
                </p>
              )}
            </div>
            <button
              onClick={openWhatsApp}
              disabled={isOutOfStock}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all shadow-md uppercase tracking-wider ${isOutOfStock
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg'
                }`}
            >
              <MessageCircle className="w-4 h-4" />
              {t('order', language)}
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard

