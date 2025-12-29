import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, MessageCircle, Instagram, Facebook } from 'lucide-react'
import { socialLinks } from '../siteConfig'
import { t } from '../translations/translations'
import { useLanguage } from '../contexts/LanguageContext'

const Footer = () => {
    const { language } = useLanguage()

    const openWhatsApp = () => {
        const phone = socialLinks.whatsapp
        const message = encodeURIComponent(t('whatsappGreeting', language))
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    }

    return (
        <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-2xl font-bold">{t('shopName', language)}</h4>
                        </div>
                        <p className="text-gray-400 leading-relaxed max-w-sm">
                            {t('footerDescription', language)}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-bold mb-4">Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link to="/" className="hover:text-gold-400 transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-gold-400 transition-colors">About Us</Link></li>
                            <li><Link to="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
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

                        <div className="flex space-x-4 mt-6">
                            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-primary p-3 rounded-full transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-primary p-3 rounded-full transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} {t('shopName', language)}. {t('allRightsReserved', language)}
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
