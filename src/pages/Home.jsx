import React, { useState, useEffect } from 'react'
import { ShoppingBag, MessageCircle, Instagram, Facebook, Sparkles } from 'lucide-react'
import API_URL from '../config'
import { useLanguage } from '../contexts/LanguageContext'
import { t } from '../translations/translations'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import TrustBadges from '../components/TrustBadges'
import Testimonials from '../components/Testimonials'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductCard from '../components/ProductCard'
import LanguageToggle from '../components/LanguageToggle'

const Home = () => {
  const { language } = useLanguage()
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
    const message = encodeURIComponent(t('whatsappGreeting', language))
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
                  {t('shopName', language)}
                </h1>
                <p className="text-sm text-gray-600">{t('shopTagline', language)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <button
                onClick={openWhatsApp}
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold hidden sm:inline">{t('contactUs', language)}</span>
              </button>
            </div>
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
            <span className="text-sm font-semibold text-gray-700">{t('handmadeTitle', language)}</span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            {t('heroTitle', language)}
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t('heroSubtitle', language)}
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t('heroDescription', language)}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={openWhatsApp}
              className="bg-primary hover:bg-secondary text-white px-10 py-4 rounded-full text-lg font-bold transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              {t('orderCustom', language)}
            </button>
            <a
              href="#products"
              className="bg-white hover:bg-gray-50 text-primary px-10 py-4 rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-xl border-2 border-primary"
            >
              {t('viewCollection', language)}
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">{t('happyCustomers', language)}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-gray-600">{t('handmade', language)}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray-600">{t('support', language)}</div>
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
              {t('ourCollection', language)}
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('browseCollection', language)}
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
                <option value="newest">{t('newest', language)}</option>
                <option value="price-low">{t('priceLowHigh', language)}</option>
                <option value="price-high">{t('priceHighLow', language)}</option>
                <option value="name">{t('nameAZ', language)}</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-md">
              <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                {searchQuery ? t('noProductsFound', language) : t('noProducts', language)}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? t('tryAdjusting', language)
                  : t('checkBackSoon', language)}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-secondary transition-colors"
                >
                  {t('clearSearch', language)}
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
            {t('readyToOrder', language)}
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
            {t('ctaDescription', language)}
          </p>
          <button
            onClick={openWhatsApp}
            className="bg-white text-primary px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-2xl transform hover:scale-105 inline-flex items-center gap-3"
          >
            <MessageCircle className="w-6 h-6" />
            {t('startOrder', language)}
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
                <h4 className="text-2xl font-bold">{t('shopName', language)}</h4>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {t('footerDescription', language)}
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4">{t('contact', language)}</h4>
              <p className="text-gray-400 mb-2">{t('whatsapp', language)}: +212 6 84 04 85 74</p>
              <button
                onClick={openWhatsApp}
                className="mt-3 flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('chatWithUs', language)}</span>
              </button>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4">{t('followUs', language)}</h4>
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
              &copy; 2024 {t('shopName', language)}. {t('allRightsReserved', language)}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
