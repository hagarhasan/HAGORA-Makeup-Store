import {
    useEffect,
    useState,
    type PropsWithChildren
} from 'react'

import { CartContext } from './cart-context'
import { useAuthContext } from './useAuthContext'

import type { CartItem, Product } from '../types/product'

type SavedCarts = Record<string, CartItem[]>

function loadCarts(): SavedCarts {
    const savedCarts = localStorage.getItem('hagoraCarts')

    if (!savedCarts) {
        return {}
    }

    try {
        return JSON.parse(savedCarts) as SavedCarts
    } catch {
        return {}
    }
}

export function CartProvider({ children }: PropsWithChildren) {
    const { user } = useAuthContext()

    const userId = user?.id ?? null

    const [carts, setCarts] = useState<SavedCarts>(() =>
        loadCarts()
    )

    const cartItems = userId
        ? carts[String(userId)] ?? []
        : []

    useEffect(() => {
        localStorage.setItem(
            'hagoraCarts',
            JSON.stringify(carts)
        )
    }, [carts])

    function addToCart(product: Product) {
        if (!userId) {
            return
        }

        setCarts(prevCarts => {
            const currentCart = prevCarts[String(userId)] ?? []

            const existingProduct = currentCart.find(
                item => item.id === product.id
            )

            const updatedCart = existingProduct
                ? currentCart.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                )
                : [
                    ...currentCart,
                    {
                        ...product,
                        quantity: 1
                    }
                ]

            return {
                ...prevCarts,
                [String(userId)]: updatedCart
            }
        })
    }

    function removeFromCart(productId: number) {
        if (!userId) {
            return
        }

        setCarts(prevCarts => ({
            ...prevCarts,
            [String(userId)]: (
                prevCarts[String(userId)] ?? []
            ).filter(item => item.id !== productId)
        }))
    }

    function increaseQuantity(productId: number) {
        if (!userId) {
            return
        }

        setCarts(prevCarts => ({
            ...prevCarts,
            [String(userId)]: (
                prevCarts[String(userId)] ?? []
            ).map(item =>
                item.id === productId
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            )
        }))
    }

    function decreaseQuantity(productId: number) {
        if (!userId) {
            return
        }

        setCarts(prevCarts => ({
            ...prevCarts,
            [String(userId)]: (
                prevCarts[String(userId)] ?? []
            )
                .map(item =>
                    item.id === productId
                        ? {
                            ...item,
                            quantity: item.quantity - 1
                        }
                        : item
                )
                .filter(item => item.quantity > 0)
        }))
    }

    function clearCart() {
        if (!userId) {
            return
        }

        setCarts(prevCarts => ({
            ...prevCarts,
            [String(userId)]: []
        }))
    }

    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    )

    const totalPrice = cartItems.reduce(
        (total, item) => {
            const price = Number(item.price)

            if (isNaN(price) || price <= 0) {
                return total
            }

            return total + price * item.quantity
        },
        0
    )

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                clearCart,
                totalItems,
                totalPrice
            }}
        >
            {children}
        </CartContext.Provider>
    )
}