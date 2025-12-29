import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, ZoomIn, Star, Shield, Truck, Heart, Share2, MessageCircle, X, ShoppingBag, Eye, Package } from 'lucide-react'
import API_URL from '../config'
import { socialLinks, siteConfig } from '../siteConfig'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import { t } from '../translations/translations'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import LanguageToggle from '../components/LanguageToggle'
import Footer from '../components/Footer'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { language } = useLanguage()
  const { addToCart, setIsCartOpen, cartCount } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageZoom, setImageZoom] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedVariants, setSelectedVariants] = useState({})
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    address: '',
    phone: '',
    quantity: 1,
    variant: null
  })
  const [selectedImage, setSelectedImage] = useState('')
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' })
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  // Track view when product loads - REMOVED, now integrated into fetchProduct
  // useEffect(() => {
  //   if (product) {
  //     trackView()
  //   }
  // }, [product?.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`)
      const data = await response.json()
      setProduct(data)

      // Set initial selected image
      if (data) {
        setSelectedImage(data.image || '')
      }

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

      // Fetch all products to find related ones (Client-side filtering for simplicity)
      if (data && data.category) {
        const allRes = await fetch(`${API_URL}/api/products`)
        const allData = await allRes.json()
        const related = allData
          .filter(p => p.category === data.category && (p._id !== id && p.id !== id))
          .slice(0, 4)
        setRelatedProducts(related)
      }

      // Track view
      await fetch(`${API_URL}/api/products/${id}/view`, { method: 'POST' })

      fetchReviews()
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}/reviews`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    setSubmittingReview(true)
    try {
      const res = await fetch(`${API_URL}/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      })
      if (res.ok) {
        setNewReview({ userName: '', rating: 5, comment: '' })
        fetchReviews()
        alert('Review submitted!')
      } else {
        alert('Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setSubmittingReview(false)
    }
  }

  // trackView function is no longer needed as its logic is moved into fetchProduct
  // const trackView = async () => {
  //   try {
  //     await fetch(`${API_URL}/api/products/${id}/view`, { method: 'POST' })
  //   } catch (error) {
  //     console.error('Error tracking view:', error)
  //   }
  // }

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

  const handleOrder = () => {
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
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-dark-700 transition-colors"
              >
                <div className="relative">
                  <ShoppingBag className="w-6 h-6 text-gold-400" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>
              </button>
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
            {/* Product Image Gallery */}
            <div className={`relative bg-dark-900 ${isOutOfStock ? 'opacity-60' : ''}`}>
              {/* Main Image */}
              <div className="aspect-square lg:aspect-auto h-[50vh] lg:h-[70vh] relative overflow-hidden group">
                <img
                  src={selectedImage || product.image || 'https://via.placeholder.com/800x800?text=Tafaya+Ashtray'}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 hover:scale-105"
                  onClick={() => setImageZoom(true)}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/800x800?text=Tafaya+Ashtray' }}
                />
                <div className="absolute bottom-4 right-4 bg-dark-800 border border-gold-600 border-opacity-30 rounded-full p-3 shadow-lg cursor-pointer hover:bg-dark-700 transition-colors" onClick={() => setImageZoom(true)}>
                  <ZoomIn className="w-5 h-5 text-gold-400" />
                </div>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-2 p-2 overflow-x-auto bg-dark-800 border-t border-gold-600 border-opacity-10">
                  <button
                    onClick={() => setSelectedImage(product.image)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === product.image ? 'border-gold-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={product.image} className="w-full h-full object-cover" alt="Main" />
                  </button>
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-gold-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}

              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                {isOutOfStock ? (
                  <div className="bg-red-600 text-white px-4 py-2 rounded-full font-bold uppercase tracking-wider shadow-lg">
                    {language === 'fr' ? 'Épuisé' : language === 'ar' ? 'نفذ' : 'Out of Stock'}
                  </div>
                ) : product.stock === null || product.stock === undefined ? (
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold uppercase tracking-wider shadow-lg">
                    {language === 'fr' ? 'Sur Commande' : language === 'ar' ? 'تحت الطلب' : 'Made to Order'}
                  </div>
                ) : (
                  <div className="bg-gold-gradient text-dark-900 px-4 py-2 rounded-full font-bold uppercase tracking-wider shadow-lg">
                    {t('handmadeBadge', language)}
                  </div>
                )}
                {product.stock !== null && product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
                  <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
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
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const variantName = Object.keys(product.variants || {}).find(v => !selectedVariants[v])
                    if (product.variants && product.variants.length > 0 && Object.keys(selectedVariants).length < product.variants.length) {
                      alert(t('selectVariant', language) || 'Please select a variant')
                      return
                    }
                    addToCart(product, selectedVariants, orderDetails.quantity)
                    setIsCartOpen(true)
                  }}
                  disabled={isOutOfStock}
                  className="flex-1 bg-gold-gradient hover:bg-gold-500 text-dark-900 font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-gold-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-6 h-6" />
                  <span>{t('addToCart', language) || 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleOrder}
                  disabled={isOutOfStock}
                  className="flex-1 border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>{t('buyNow', language) || 'Buy Now (WhatsApp)'}</span>
                </button>
              </div>

              {!isOutOfStock && (
                <p className="text-center text-gray-500 text-sm mt-4">
                  {t('redirectMessage', language)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="container mx-auto px-4 py-8 max-w-4xl">
        <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-4 flex items-center gap-3">
          <Star className="w-8 h-8 text-gold-400 fill-current" />
          {t('customerReviews', language) || 'Customer Reviews'} <span className="text-gray-500 text-lg font-normal">({reviews.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Review List */}
          <div className="space-y-6">
            {reviews.length === 0 ? (
              <p className="text-gray-400 italic">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="bg-dark-800 p-4 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white">{review.userName}</span>
                    <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-gold-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm">{review.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="bg-dark-800 p-6 rounded-xl border border-gold-600 border-opacity-20 h-fit">
            <h3 className="text-xl font-bold text-white mb-4">{t('writeReview', language) || 'Write a Review'}</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newReview.userName}
                  onChange={e => setNewReview({ ...newReview, userName: e.target.value })}
                  className="w-full bg-dark-900 border border-gray-700 rounded-lg p-2 text-white focus:border-gold-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`p-1 transition-transform hover:scale-110 ${newReview.rating >= star ? 'text-gold-400' : 'text-gray-600'}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Review</label>
                <textarea
                  required
                  rows="3"
                  value={newReview.comment}
                  onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full bg-dark-900 border border-gray-700 rounded-lg p-2 text-white focus:border-gold-500 outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-gold-gradient text-dark-900 font-bold py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12 border-t border-gold-600 border-opacity-20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('youMayAlsoLike', language) || 'You May Also Like'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(item => (
              <div
                key={item.id || item._id}
                onClick={() => {
                  navigate(`/product/${item.id || item._id}`)
                  window.scrollTo(0, 0)
                }}
                className="bg-dark-800 rounded-xl overflow-hidden shadow-lg border border-gold-600 border-opacity-10 hover:border-opacity-30 transition-all cursor-pointer group"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.image || 'https://via.placeholder.com/300'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-bold truncate">{item.name}</h3>
                  <p className="text-gold-400 font-bold mt-1">{item.price} MAD</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Image Zoom Modal */}
      {imageZoom && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
          onClick={() => setImageZoom(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gold-400 p-2"
            onClick={() => setImageZoom(false)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage || product.image}
            alt={product.name}
            className="max-w-full max-h-screen object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  )
}

export default ProductDetail

