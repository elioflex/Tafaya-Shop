import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, MessageCircle, Instagram, Facebook } from 'lucide-react'
import API_URL from '../config'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const openWhatsApp = () => {
    const phone = '212684048574'
    const message = encodeURIComponent('Hello! I would like to know more about your handmade Tafaya ashtrays.')
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBag className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">Tafaya Shop</h1>
                <p className="text-sm text-gray-600">Handmade Custom Ashtrays</p>
              </div>
            </div>
            <button
              onClick={openWhatsApp}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Contact Us</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            Handmade Tafaya Ashtrays
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover unique, handcrafted ashtrays made with passion and precision. 
            Each piece is custom-made to your specifications.
          </p>
          <button
            onClick={openWhatsApp}
            className="bg-primary hover:bg-secondary text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Order Your Custom Ashtray
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Our Collection
          </h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No products available yet.</p>
              <p className="text-gray-500 mt-2">Check back soon for amazing handmade ashtrays!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <div className="aspect-square bg-gray-200 overflow-hidden">
                    <img
                      src={product.image || 'https://via.placeholder.com/400x400?text=Tafaya+Ashtray'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=Tafaya+Ashtray' }}
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {product.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    {product.price && (
                      <p className="text-primary font-bold text-xl mb-3">
                        {product.price} MAD
                      </p>
                    )}
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Order on WhatsApp</span>
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">Tafaya Shop</h4>
              <p className="text-gray-400">
                Handmade custom ashtrays crafted with passion and precision.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Contact</h4>
              <p className="text-gray-400">WhatsApp: +212 6 84 04 85 74</p>
              <button
                onClick={openWhatsApp}
                className="mt-3 flex items-center space-x-2 text-green-400 hover:text-green-300"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with us</span>
              </button>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <Instagram className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
                <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2024 Tafaya Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
