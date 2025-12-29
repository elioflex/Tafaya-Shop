import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cart')
            return savedCart ? JSON.parse(savedCart) : []
        } catch (error) {
            console.error('Error loading cart:', error)
            return []
        }
    })

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    const [isCartOpen, setIsCartOpen] = useState(false)

    const addToCart = (product, variant, quantity = 1) => {
        setCart(prevCart => {
            // Create a unique ID for the item based on product ID and variant
            const variantId = variant ? variant._id || variant.name : 'default'
            const existingItemIndex = prevCart.findIndex(
                item => item.id === product.id &&
                    (item.variant?.name === variant?.name) // Simplify variant check
            )

            if (existingItemIndex > -1) {
                // Update quantity if item exists
                const newCart = [...prevCart]
                newCart[existingItemIndex].quantity += quantity
                toast.success(`Updated quantity for ${product.name}`)
                return newCart
            } else {
                // Add new item
                toast.success(`Added ${product.name} to cart`)
                return [...prevCart, {
                    ...product,
                    variant,
                    quantity,
                    cartId: Date.now() // Unique ID for key
                }]
            }
        })
    }

    const removeFromCart = (cartId) => {
        setCart(prevCart => prevCart.filter(item => item.cartId !== cartId))
        toast.error('Removed from cart')
    }

    const updateQuantity = (cartId, newQuantity) => {
        if (newQuantity < 1) return
        setCart(prevCart => prevCart.map(item =>
            item.cartId === cartId ? { ...item, quantity: newQuantity } : item
        ))
    }

    const clearCart = () => {
        setCart([])
    }

    const cartTotal = cart.reduce((total, item) => {
        let price = parseFloat(item.price) || 0
        if (item.variant && item.variant.priceModifier) {
            price += item.variant.priceModifier
        }
        return total + (price * item.quantity)
    }, 0)

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    )
}
