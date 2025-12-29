import React from 'react'
import Footer from '../components/Footer'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const Privacy = () => {
    return (
        <div className="min-h-screen bg-dark-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <Link to="/" className="inline-flex items-center gap-2 text-gold-400 mb-8 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Shop
                </Link>

                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold text-gold-400">Privacy Policy</h1>
                    <div className="space-y-4 text-gray-300">
                        <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when ordering (Name, Phone, Address).</p>

                        <h2 className="text-xl font-bold text-white">2. How We Use Information</h2>
                        <p>We use this information to process your orders and communicate with you via WhatsApp.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Privacy
