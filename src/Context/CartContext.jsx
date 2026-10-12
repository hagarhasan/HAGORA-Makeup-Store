import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {

    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('hagoraCart')

        return savedCart
            ? JSON.parse(savedCart)
            : []
    })

    useEffect(() => {
        localStorage.setItem(
            'hagoraCart',
            JSON.stringify(cartItems)
        )
    }, [cartItems])

    function addToCart(product) {

        setCartItems(prevItems => {

            const existingProduct = prevItems.find(
                item => item.id === product.id
            )

            if (existingProduct) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                )
            }

            return [
                ...prevItems,
                {
                    ...product,
                    quantity: 1
                }
            ]
        })
    }

    function removeFromCart(productId) {
        setCartItems(prevItems =>
            prevItems.filter(item => item.id !== productId)
        )
    }

    function increaseQuantity(productId) {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? {
                        ...item,
                        quantity: item.quantity + 1
                    }
                    : item
            )
        )
    }

    function decreaseQuantity(productId) {
        setCartItems(prevItems =>
            prevItems
                .map(item =>
                    item.id === productId
                        ? {
                            ...item,
                            quantity: item.quantity - 1
                        }
                        : item
                )
                .filter(item => item.quantity > 0)
        )
    }

    function clearCart() {
        setCartItems([])
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

export function useCart() {
    return useContext(CartContext)
}