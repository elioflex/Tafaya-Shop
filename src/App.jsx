import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from './contexts/LanguageContext'
import { CartProvider } from './contexts/CartContext'
import Home from './pages/Home'
import Admin from './pages/Admin'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import CartDrawer from './components/CartDrawer'
import { startKeepAlive } from './utils/keepAlive'

function App() {
  useEffect(() => {
    // Start pinging backend to prevent spin-down
    startKeepAlive()
  }, [])

  return (
    <HelmetProvider>
      <LanguageProvider>
        <CartProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
            <CartDrawer />
            <Toaster position="bottom-right" />
          </Router>
        </CartProvider>
      </LanguageProvider>
    </HelmetProvider>
  )
}

export default App

