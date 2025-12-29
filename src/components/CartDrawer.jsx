import React, { useRef, useEffect, useState } from 'react'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { socialLinks } from '../siteConfig'
import { t } from '../translations/translations'
import { useLanguage } from '../contexts/LanguageContext'
import API_URL from '../config'

const CartDrawer = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart, isCartOpen, setIsCartOpen } = useCart()
    const { language } = useLanguage()
    const overlayRef = useRef(null)

    const [step, setStep] = useState('cart') // 'cart' | 'details'
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Reset step when closed
    useEffect(() => {
        if (!isCartOpen) {
            setStep('cart')
            setIsSubmitting(false)
        }
    }, [isCartOpen])

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isCartOpen])

    if (!isCartOpen) return null

    const handleConfirmOrder = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // 1. Save Order to DB
            const orderData = {
                customer: formData,
                items: cart.map(item => ({
                    productId: item.id || item._id, // Handle fallback
                    name: item.name,
                    variant: item.variant ? { name: item.variant.name, option: item.variant.options[0].value } : null,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: cartTotal
            }

            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            })

            if (!response.ok) throw new Error('Failed to create order')

            const order = await response.json()
            const orderId = order.id || order._id

            // 2. Construct WhatsApp message with Order ID
            let message = `${t('whatsappGreeting', language)} \n`
            message += `Ref: #${orderId.toString().slice(-6)} \n\n` // Short ID
            message += `* ${t('orderSummary', language)}:*\n`

            cart.forEach(item => {
                const variantText = item.variant ? ` (${item.variant.name}: ${item.variant.options[0].value})` : ''
                message += `- ${item.quantity}x ${item.name}${variantText} \n`
            })

            message += `\n * Total: ${cartTotal} MAD *\n\n`
            message += `* Info:*\n${formData.name} \n${formData.address} `

            // 3. Open WhatsApp
            const phone = socialLinks.whatsapp
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')

            // 4. Clear and Close
            clearCart()
            setIsCartOpen(false)
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Error creating order. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-dark-900 h-full shadow-2xl transform transition-transform border-l border-gold-600 border-opacity-20 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-dark-700 flex items-center justify-between bg-dark-800">
                    <div className="flex items-center gap-2">
                        {step === 'details' && (
                            <button onClick={() => setStep('cart')} className="mr-2 text-gold-400 hover:text-white">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <h2 className="text-xl font-bold text-gold-400 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5" />
                            {step === 'cart'
                                ? (language === 'fr' ? 'Panier' : language === 'ar' ? 'عربة التسوق' : 'Shopping Cart')
                                : (language === 'fr' ? 'Détails' : language === 'ar' ? 'تفاصيل' : 'Checkout Details')
                            }
                        </h2>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-dark-700 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                {step === 'cart' ? (
                    <>
                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                                    <ShoppingBag className="w-16 h-16 opacity-20" />
                                    <p>{language === 'fr' ? 'Votre panier est vide' : language === 'ar' ? 'عربة التسوق فارغة' : 'Your cart is empty'}</p>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="text-gold-400 hover:text-gold-300 font-medium"
                                    >
                                        {t('backToShop', language)}
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.cartId} className="bg-dark-800 rounded-lg p-3 flex gap-3 border border-dark-700">
                                        <img
                                            src={item.image || 'https://via.placeholder.com/100'}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-md border border-dark-600"
                                        />
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-200 line-clamp-1">{item.name}</h3>
                                                {item.variant && (
                                                    <p className="text-xs text-gray-400">
                                                        {item.variant.name}: {item.variant.options[0].value}
                                                    </p>
                                                )}
                                                <p className="text-gold-400 font-medium text-sm mt-1">
                                                    {item.price * item.quantity} MAD
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center bg-dark-900 rounded-lg p-1 border border-dark-700">
                                                    <button
                                                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                                        className="p-1 hover:text-gold-400 disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="mx-2 text-sm font-medium w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                                        className="p-1 hover:text-gold-400"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.cartId)}
                                                    className="text-red-500 hover:text-red-400 p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-4 bg-dark-800 border-t border-dark-700 space-y-4">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span className="text-gray-300">Total</span>
                                    <span className="text-gold-400">{cartTotal} MAD</span>
                                </div>

                                <button
                                    onClick={() => setStep('details')}
                                    className="w-full bg-gold-gradient hover:bg-gold-500 text-dark-900 font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <span>{language === 'fr' ? 'Commander' : language === 'ar' ? 'طلب' : 'Checkout'}</span>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <form onSubmit={handleConfirmOrder} className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">{t('fullName', language) || 'Full Name'}</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-dark-800 border border-dark-600 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">{t('phone', language) || 'Phone Number'}</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-dark-800 border border-dark-600 rounded-lg p-3 text-white focus:border-gold-500 outline-none"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-1">{t('address', language) || 'Address'}</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="w-full bg-dark-800 border border-dark-600 rounded-lg p-3 text-white focus:border-gold-500 outline-none resize-none"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-dark-700">
                            <div className="flex justify-between items-center text-lg font-bold mb-4">
                                <span className="text-gray-300">Total</span>
                                <span className="text-gold-400">{cartTotal} MAD</span>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span className="animate-pulse">Processing...</span>
                                ) : (
                                    <>
                                        <MessageCircle className="w-5 h-5" />
                                        <span>{language === 'fr' ? 'Confirmer sur WhatsApp' : language === 'ar' ? 'تأكيد عبر واتساب' : 'Confirm on WhatsApp'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}    </div>
        </div>
    )
}

export default CartDrawer
