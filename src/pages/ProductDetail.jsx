import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, MessageCircle, ShoppingBag, Share2, Heart, ZoomIn, Star, Shield, Truck, Eye, Package } from 'lucide-react'
import API_URL from '../config'
import { socialLinks, siteConfig } from '../siteConfig'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations/translations'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import LanguageToggle from '../components/LanguageToggle'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageZoom, setImageZoom] = useState(false)
  const [selectedVariants, setSelectedVariants] = useState({})
  const [orderDetails, setOrderDetails] = useState({
    quantity: 1,
    address: ''
  })

  useEffect(() => {
    fetchProduct()
  }, [id])

  // Track view when product loads
  useEffect(() => {
    if (product) {
      trackView()
    }
  }, [product?.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`)
      const data = await response.json()
      setProduct(data)

      // Initialize variant selections
      if (data.variants && data.variants.length > 0) {
        const initialVariants = {}
        data.variants.forEach(variant => {
          if (variant.options && variant.options.length > 0) {
            initialVariants[variant.name] = variant.options[0]
          }
        })
        setSelectedVariants(initialVariants)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const trackView = async () => {
    try {
      await fetch(`${API_URL}/api/products/${id}/view`, { method: 'POST' })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  const isOutOfStock = product?.stock !== null && product?.stock !== undefined && product?.stock <= 0

  const calculatePrice = () => {
    if (!product?.price) return null
    let price = product.price
    Object.values(selectedVariants).forEach(variant => {
      if (variant.priceModifier) {
        price += variant.priceModifier
      }
    })
    return price
  }

  const orderOnWhatsApp = () => {
    if (isOutOfStock) return
    const phone = socialLinks.whatsapp
    let message = `${t('whatsappOrder', language)}\n\n*${product.name}*\n`

    // Add variant selections
    Object.entries(selectedVariants).forEach(([name, option]) => {
      message += `${name}: ${option.value}\n`
    })

    const unitPrice = calculatePrice()
    if (unitPrice) {
      const totalPrice = unitPrice * orderDetails.quantity
      message += `${t('price', language)}: ${unitPrice} MAD x ${orderDetails.quantity} = ${totalPrice} MAD\n`
    }

    message += `${t('quantity', language)}: ${orderDetails.quantity}\n`

    if (orderDetails.address) {
      message += `\n${t('shippingAddress', language)}:\n${orderDetails.address}`
    }

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-gold-600"></div>
          <p className="mt-4 text-gray-400 font-medium">{t('loadingProduct', language)}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gold-600 mx-auto mb-4 opacity-50" />
          <p className="text-gray-400 text-xl mb-4">{t('noProducts', language)}</p>
          <button
            onClick={() => navigate('/')}
            className="text-gold-400 hover:text-gold-300 font-semibold"
          >
            {t('backToShop', language)}
          </button>
        </div>
      </div>
    )
  }

  const displayPrice = calculatePrice()

  return (
    <div className="min-h-screen bg-dark-900">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{product.name} - {siteConfig.name}</title>
        <meta name="description" content={product.description} />
        <link rel="canonical" href={`${siteConfig.url}/product/${id}`} />

        {/* OpenGraph */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`${product.name} - ${siteConfig.name}`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image || `${siteConfig.url}${siteConfig.image}`} />
        <meta property="og:url" content={`${siteConfig.url}/product/${id}`} />
        {displayPrice && <meta property="product:price:amount" content={displayPrice} />}
        <meta property="product:price:currency" content="MAD" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.name} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={product.image} />
      </Helmet>

      <FloatingWhatsApp />

      {/* Header */}
      <header className="bg-dark-800 bg-opacity-95 shadow-2xl sticky top-0 z-40 backdrop-blur-md border-b border-gold-600 border-opacity-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-400 hover:text-gold-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{t('backToShop', language)}</span>
            </button>

            <div className="flex items-center gap-3">
              <LanguageToggle />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full hover:bg-dark-700 transition-colors"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
              <button
                onClick={shareProduct}
                className="p-2 rounded-full hover:bg-dark-700 transition-colors"
              >
                <Share2 className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-dark-800 border border-gold-600 border-opacity-20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className={`relative bg-dark-900 aspect-square lg:aspect-auto ${isOutOfStock ? 'opacity-60' : ''}`}>
              <img
                src={product.image || 'https://via.placeholder.com/800x800?text=Tafaya+Ashtray'}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setImageZoom(true)}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x800?text=Tafaya+Ashtray' }}
              />
              <div className="absolute bottom-4 right-4 bg-dark-800 border border-gold-600 border-opacity-30 rounded-full p-3 shadow-lg">
                <ZoomIn className="w-5 h-5 text-gold-400" />
              </div>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isOutOfStock ? (
                  <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold uppercase tracking-wider">
                    {language === 'fr' ? 'Épuisé' : language === 'ar' ? 'نفذ' : 'Out of Stock'}
                  </div>
                ) : (
                  <div className="bg-gold-gradient text-dark-900 px-4 py-2 rounded-full font-bold uppercase tracking-wider">
                    {t('handmadeBadge', language)}
                  </div>
                )}
                {product.stock !== null && product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold">
                    {language === 'fr' ? `Plus que ${product.stock}!` : language === 'ar' ? `${product.stock} فقط!` : `Only ${product.stock} left!`}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info & Customization */}
            <div className="p-8 lg:p-12">
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
                {product.name}
              </h1>

              {/* Rating & Views */}
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-gold-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-400">(50+ {t('reviews', language)})</span>
                </div>
                {product.views > 0 && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>{product.views} {language === 'fr' ? 'vues' : 'views'}</span>
                  </div>
                )}
              </div>

              {displayPrice && (
                <div className="mb-8">
                  <p className="text-5xl font-black gold-shine mb-2">
                    {displayPrice} <span className="text-2xl">MAD</span>
                  </p>
                  <p className="text-gray-400">{t('freeDelivery', language)}</p>
                </div>
              )}

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4 mb-8">
                  {product.variants.map((variant) => (
                    <div key={variant.name}>
                      <label className="block text-sm font-semibold text-gray-400 mb-2">
                        {variant.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setSelectedVariants({ ...selectedVariants, [variant.name]: option })}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedVariants[variant.name]?.value === option.value
                                ? 'bg-gold-gradient text-dark-900'
                                : 'bg-dark-900 text-white border border-gold-600 border-opacity-20 hover:border-opacity-50'
                              }`}
                          >
                            {option.value}
                            {option.priceModifier && option.priceModifier !== 0 && (
                              <span className="ml-1 text-sm">
                                ({option.priceModifier > 0 ? '+' : ''}{option.priceModifier} MAD)
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-dark-900 border border-gold-600 border-opacity-20 rounded-xl">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-300">{t('qualityGuaranteed', language)}</p>
                </div>
                <div className="text-center">
                  <Heart className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-300">{t('handcrafted', language)}</p>
                </div>
                <div className="text-center">
                  <Truck className="w-8 h-8 text-gold-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-300">{t('fastDelivery', language)}</p>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-6 mb-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {t('orderDetails', language)}
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    {t('quantity', language)}
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setOrderDetails({ ...orderDetails, quantity: Math.max(1, orderDetails.quantity - 1) })}
                      className="bg-dark-900 border-2 border-gold-600 border-opacity-20 text-gold-400 w-12 h-12 rounded-xl font-bold text-xl hover:border-opacity-50 transition-all"
                      disabled={isOutOfStock}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock || 999}
                      value={orderDetails.quantity}
                      onChange={(e) => {
                        const max = product.stock || 999
                        const val = Math.min(max, Math.max(1, parseInt(e.target.value) || 1))
                        setOrderDetails({ ...orderDetails, quantity: val })
                      }}
                      className="w-24 px-4 py-3 bg-dark-900 border-2 border-gold-600 border-opacity-20 rounded-xl focus:ring-2 focus:ring-gold-600 focus:border-gold-600 text-white text-center font-bold text-lg transition-all"
                      disabled={isOutOfStock}
                    />
                    <button
                      onClick={() => {
                        const max = product.stock || 999
                        setOrderDetails({ ...orderDetails, quantity: Math.min(max, orderDetails.quantity + 1) })
                      }}
                      className="bg-dark-900 border-2 border-gold-600 border-opacity-20 text-gold-400 w-12 h-12 rounded-xl font-bold text-xl hover:border-opacity-50 transition-all"
                      disabled={isOutOfStock}
                    >
                      +
                    </button>
                  </div>
                  {displayPrice && (
                    <p className="text-gray-400 mt-2">
                      {t('total', language)}: <span className="text-gold-400 font-bold text-xl">{displayPrice * orderDetails.quantity} MAD</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">
                    {t('shippingAddress', language)}
                  </label>
                  <textarea
                    value={orderDetails.address}
                    onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
                    placeholder={t('addressPlaceholder', language)}
                    rows="4"
                    className="w-full px-4 py-3 bg-dark-900 border-2 border-gold-600 border-opacity-20 rounded-xl focus:ring-2 focus:ring-gold-600 focus:border-gold-600 text-white placeholder-gray-500 resize-none transition-all"
                    required
                    disabled={isOutOfStock}
                  />
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={orderOnWhatsApp}
                disabled={isOutOfStock}
                className={`w-full py-5 rounded-xl font-black text-lg transition-all shadow-xl flex items-center justify-center space-x-3 uppercase tracking-wider ${isOutOfStock
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-2xl transform hover:scale-105'
                  }`}
              >
                <MessageCircle className="w-6 h-6" />
                <span>{isOutOfStock ? (language === 'fr' ? 'Épuisé' : 'Out of Stock') : t('orderOnWhatsApp', language)}</span>
              </button>

              {!isOutOfStock && (
                <p className="text-center text-gray-500 text-sm mt-4">
                  {t('redirectMessage', language)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {imageZoom && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setImageZoom(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
            onClick={() => setImageZoom(false)}
          >
            ×
          </button>
          <img
            src={product.image || 'https://via.placeholder.com/1200x1200?text=Tafaya+Ashtray'}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  )
}

export default ProductDetail

