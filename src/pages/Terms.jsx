import React from 'react'
import Footer from '../components/Footer'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const Terms = () => {
    return (
        <div className="min-h-screen bg-dark-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <Link to="/" className="inline-flex items-center gap-2 text-gold-400 mb-8 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Shop
                </Link>

                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold text-gold-400">Terms of Service</h1>
                    <div className="space-y-4 text-gray-300">
                        <h2 className="text-xl font-bold text-white">1. Introduction</h2>
                        <p>Welcome to Tafaya Shop. By accessing our website, you agree to these terms.</p>

                        <h2 className="text-xl font-bold text-white">2. Orders</h2>
                        <p>All orders are subject to availability and confirmation of the order price.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Terms
