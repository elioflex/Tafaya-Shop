import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MessageCircle, ShoppingBag } from 'lucide-react'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
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
      const response = await fetch(`/api/products/${id}`)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Product not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary hover:text-secondary font-semibold"
          >
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-primary hover:text-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Shop</span>
          </button>
        </div>
      </header>

      {/* Product Detail */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square bg-gray-200">
              <img
                src={product.image?.startsWith('http') ? product.image : `http://localhost:5001${product.image}`}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=Tfaya+Ashtray' }}
              />
            </div>

            {/* Product Info & Customization */}
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>
              
              {product.price && (
                <p className="text-3xl font-bold text-primary mb-6">
                  {product.price} MAD
                </p>
              )}

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Customization Options */}
              <div className="space-y-6 mb-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                  Customize Your Order
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <select
                    value={customization.size}
                    onChange={(e) => setCustomization({ ...customization, size: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select size</option>
                    <option value="Small">Small</option>
                    <option value="Medium">Medium</option>
                    <option value="Large">Large</option>
                    <option value="Custom">Custom Size</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={customization.color}
                    onChange={(e) => setCustomization({ ...customization, color: e.target.value })}
                    placeholder="e.g., Black, White, Blue, Custom color..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Design Preference
                  </label>
                  <input
                    type="text"
                    value={customization.design}
                    onChange={(e) => setCustomization({ ...customization, design: e.target.value })}
                    placeholder="e.g., Minimalist, Geometric, Traditional..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={customization.notes}
                    onChange={(e) => setCustomization({ ...customization, notes: e.target.value })}
                    placeholder="Any special requests or details..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={orderOnWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 transform hover:scale-105"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Order on WhatsApp</span>
              </button>

              <p className="text-center text-gray-500 text-sm mt-4">
                You'll be redirected to WhatsApp to complete your order
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
