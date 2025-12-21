import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Home from './pages/Home'
import Admin from './pages/Admin'
import ProductDetail from './pages/ProductDetail'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App
