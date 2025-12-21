import React, { useState, useEffect } from 'react'
import { ShoppingBag, MessageCircle, Instagram, Facebook, Sparkles } from 'lucide-react'
import API_URL from '../config'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import TrustBadges from '../components/TrustBadges'
import Testimonials from '../components/Testimonials'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

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

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0)
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0)
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50">
      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Tafaya Shop
                </h1>
                <p className="text-sm text-gray-600">Handmade Custom Ashtrays</p>
              </div>
            </div>
            <button
              onClick={openWhatsApp}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold hidden sm:inline">Contact Us</span>
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-gray-700">100% Handcrafted in Morocco</span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Handmade Tafaya
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ashtrays
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Discover unique, handcrafted ashtrays made with passion and precision. 
            Each piece is custom-made to your specifications.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={openWhatsApp}
              className="bg-primary hover:bg-secondary text-white px-10 py-4 rounded-full text-lg font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Order Custom Ashtray
            </button>
            <a
              href="#products"
              className="bg-white hover:bg-gray-50 text-primary px-10 py-4 rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-xl border-2 border-primary"
            >
              View Collection
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-gray-600">Handmade</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Products Section */}
      <section id="products" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">
              Our Collection
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our exclusive collection of handmade ashtrays
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />

            <div className="flex justify-center gap-4 flex-wrap">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-2 border-2 border-gray-200 rounded-full focus:border-primary focus:outline-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md">
              <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                {searchQuery ? 'No products found' : 'No products available yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Check back soon for amazing handmade ashtrays!'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Order Your Custom Ashtray?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Contact us on WhatsApp and let's create something unique together
          </p>
          <button
            onClick={openWhatsApp}
            className="bg-white text-primary px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105 inline-flex items-center gap-3"
          >
            <MessageCircle className="w-6 h-6" />
            Start Your Order Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold">Tafaya Shop</h4>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Handmade custom ashtrays crafted with passion and precision. 
                Each piece tells a unique story.
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4">Contact</h4>
              <p className="text-gray-400 mb-2">WhatsApp: +212 6 84 04 85 74</p>
              <button
                onClick={openWhatsApp}
                className="mt-3 flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat with us</span>
              </button>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-primary p-3 rounded-full transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-primary p-3 rounded-full transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              &copy; 2024 Tafaya Shop. All rights reserved. Made with ❤️ in Morocco
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
