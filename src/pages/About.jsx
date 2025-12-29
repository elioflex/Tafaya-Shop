import React from 'react'
import Footer from '../components/Footer'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const About = () => {
    return (
        <div className="min-h-screen bg-dark-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <Link to="/" className="inline-flex items-center gap-2 text-gold-400 mb-8 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Shop
                </Link>

                <div className="max-w-3xl mx-auto space-y-8">
                    <h1 className="text-4xl font-bold text-gold-400">About Us</h1>
                    <p className="text-gray-300 leading-relaxed text-lg">
                        Welcome to <span className="text-white font-bold">Tafaya Shop</span>, where tradition meets modern craftsmanship.
                        Detailed information about the brand, mission, and story goes here.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                        Founded in Morocco, we specialize in handcrafted goods...
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default About
