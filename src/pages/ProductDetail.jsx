import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, ShoppingBag, Share2, Heart, ZoomIn, Star, Shield, Truck } from 'lucide-react'
import API_URL from '../config'
import FloatingWhatsApp from '../components/FloatingWhatsApp'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageZoom, setImageZoom] = useState(false)
  const [customization, setCustomization] = useState({
    size: '',
    color: '',
    design: '',
    notes: ''
  })

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`)
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const orderOnWhatsApp = () => {
    const phone = '212684048574'
    let message = `Hello! I would like to order:\n\n*${product.name}*\n`
    
    if (product.price) {
      message += `Price: ${product.price} MAD\n`
    }
    
    if (customization.size) {
      message += `Size: ${customization.size}\n`
    }
    if (customization.color) {
      message += `Color: ${customization.color}\n`
    }
    if (customization.design) {
      message += `Design: ${customization.design}\n`
    }
    if (customization.notes) {
      message += `\nAdditional Notes:\n${customization.notes}`
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-xl mb-4">Product not found</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-secondary font-semibold"
          >
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <FloatingWhatsApp />

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Shop</span>
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
              <button
                onClick={shareProduct}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative bg-gray-100 aspect-square lg:aspect-auto">
              <img
                src={product.image || 'https://via.placeholder.com/800x800?text=Tafaya+Ashtray'}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setImageZoom(true)}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/800x800?text=Tafaya+Ashtray' }}
              />
              <div className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg">
                <ZoomIn className="w-5 h-5 text-gray-600" />
              </div>
              <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-full font-semibold">
                Handmade
              </div>
            </div>

            {/* Product Info & Customization */}
            <div className="p-8 lg:p-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(50+ reviews)</span>
              </div>

              {product.price && (
                <div className="mb-8">
                  <p className="text-5xl font-bold text-primary mb-2">
                    {product.price} <span className="text-2xl">MAD</span>
                  </p>
                  <p className="text-gray-500">Free delivery across Morocco</p>
                </div>
              )}

              <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-amber-50 rounded-xl">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Quality Guaranteed</p>
                </div>
                <div className="text-center">
                  <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Handcrafted</p>
                </div>
                <div className="text-center">
                  <Truck className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Fast Delivery</p>
                </div>
              </div>

              {/* Customization Options */}
              <div className="space-y-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Customize Your Order
                </h3>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Size
                  </label>
                  <select
                    value={customization.size}
                    onChange={(e) => setCustomization({ ...customization, size: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">Select size</option>
                    <option value="Small">Small (8cm)</option>
                    <option value="Medium">Medium (12cm)</option>
                    <option value="Large">Large (16cm)</option>
                    <option value="Custom">Custom Size</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color Preference
                  </label>
                  <input
                    type="text"
                    value={customization.color}
                    onChange={(e) => setCustomization({ ...customization, color: e.target.value })}
                    placeholder="e.g., Black, White, Blue, Custom color..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Design Style
                  </label>
                  <input
                    type="text"
                    value={customization.design}
                    onChange={(e) => setCustomization({ ...customization, design: e.target.value })}
                    placeholder="e.g., Minimalist, Geometric, Traditional..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={customization.notes}
                    onChange={(e) => setCustomization({ ...customization, notes: e.target.value })}
                    placeholder="Any special requests or details..."
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
                  />
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={orderOnWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-5 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 transform hover:scale-105"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Order on WhatsApp</span>
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                💬 You'll be redirected to WhatsApp to complete your order
              </p>
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
