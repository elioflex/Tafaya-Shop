import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LanguageProvider } from './contexts/LanguageContext'
import Home from './pages/Home'
import Admin from './pages/Admin'
import ProductDetail from './pages/ProductDetail'
import { startKeepAlive } from './utils/keepAlive'

function App() {
  useEffect(() => {
    // Start pinging backend to prevent spin-down
    startKeepAlive()
  }, [])

  return (
    <HelmetProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </HelmetProvider>
  )
}

export default App

