import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ShoppingBag, MessageCircle, Instagram, Facebook, Sparkles } from 'lucide-react'
import API_URL from '../config'
import { socialLinks, siteConfig } from '../siteConfig'
import { useLanguage } from '../contexts/LanguageContext'
import { useCart } from '../contexts/CartContext'
import { t } from '../translations/translations'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import TrustBadges from '../components/TrustBadges'
import Testimonials from '../components/Testimonials'
import SearchBar from '../components/SearchBar'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductCard from '../components/ProductCard'
import LanguageToggle from '../components/LanguageToggle'
import Footer from '../components/Footer'

const Home = () => {
  const { language } = useLanguage()
  const { cartCount, setIsCartOpen } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const [selectedCategory, setSelectedCategory] = useState('All')
  const categories = ['All', 'Ashtrays', 'Home Decor', 'Accessories', 'Custom']

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
    const phone = socialLinks.whatsapp
    const message = encodeURIComponent(t('whatsappGreeting', language))
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
  }

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0)
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0)
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="min-h-screen bg-dark-900">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{siteConfig.name} - {t('shopTagline', language)}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="keywords" content="ashtray, handmade, custom, morocco, tafaya, cendrier" />
        <link rel="canonical" href={siteConfig.url} />

        {/* OpenGraph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${siteConfig.name} - ${t('shopTagline', language)}`} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:image" content={`${siteConfig.url}${siteConfig.image}`} />
        <meta property="og:url" content={siteConfig.url} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteConfig.name} />
        <meta name="twitter:description" content={siteConfig.description} />
      </Helmet>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp />

      {/* Header */}
      <header className="bg-dark-800 bg-opacity-95 shadow-2xl sticky top-0 z-40 backdrop-blur-md border-b border-gold-600 border-opacity-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gold-gradient p-2 rounded-lg animate-glow">
                <ShoppingBag className="w-8 h-8 text-dark-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gold-400">
                  {t('shopName', language)}
                </h1>
                <p className="text-sm text-gray-400">{t('shopTagline', language)}</p>
              </div>
            </div>
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
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="/hero-background.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/70 to-dark-900 opacity-90"></div>
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gold-400 rounded-full opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 20}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto text-center relative z-10 luxury-fade-in">
          <div className="inline-flex items-center gap-2 bg-dark-800 border border-gold-600 border-opacity-30 px-6 py-3 rounded-full shadow-2xl mb-8 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-gold-400 animate-pulse" />
            <span className="text-sm font-bold text-gold-400 tracking-wider uppercase">{t('handmadeTitle', language)}</span>
          </div>

          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
            {t('heroTitle', language)}
            <br />
            <span className="gold-shine text-7xl md:text-8xl lg:text-9xl">
              {t('heroSubtitle', language)}
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            {t('heroDescription', language)}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={openWhatsApp}
              className="bg-gold-gradient hover:shadow-gold-600 text-dark-900 px-12 py-5 rounded-full text-lg font-black transition-all shadow-2xl hover:shadow-[0_0_40px_rgba(217,119,6,0.6)] transform hover:scale-110 flex items-center gap-3 uppercase tracking-wider animate-glow"
            >
              <MessageCircle className="w-6 h-6" />
              {t('orderCustom', language)}
            </button>
            <a
              href="#products"
              className="bg-transparent hover:bg-dark-700 text-gold-400 px-12 py-5 rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-2xl border-2 border-gold-600 hover:border-gold-400 uppercase tracking-wider"
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
      <section id="products" className="py-20 px-4 bg-dark-900">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-5xl md:text-6xl font-black text-white mb-6">
              {t('ourCollection', language)}
            </h3>
            <div className="w-24 h-1 bg-gold-gradient mx-auto mb-6"></div>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
              {t('browseCollection', language)}
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 space-y-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
            />

            {/* Category Filter Pills */}
            <div className="flex justify-center gap-3 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === cat
                    ? 'bg-gold-gradient text-dark-900 shadow-lg scale-105'
                    : 'bg-dark-800 text-gray-400 hover:bg-dark-700 border border-dark-700'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

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
      <Footer />
    </div>
  )
}

export default Home
