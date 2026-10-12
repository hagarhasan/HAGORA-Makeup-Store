import { createContext } from 'react'
import type { CartItem, Product } from '../types/product'

export interface CartContextValue {
    cartItems: CartItem[]
    addToCart: (product: Product) => void
    removeFromCart: (productId: number) => void
    increaseQuantity: (productId: number) => void
    decreaseQuantity: (productId: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
}

export const CartContext = createContext<CartContextValue | null>(null)