import React, { useState } from 'react'
import Header from '../../Components/Header/Header'
import { useCart } from '../../Context/CartContext'
import CartItems from '../../Components/Cart/CartItems/CartItems'
import OrderSummary from '../../Components/Cart/OrderSummary/OrderSummary'
import EmptyCart from '../../Components/Cart/EmptyCart/EmptyCart'
import OrderSuccess from '../../Components/Cart/OrderSuccess/OrderSuccess'

export default function Cart() {

    const {
        cartItems,
        clearCart
    } = useCart()

    const [orderPlaced, setOrderPlaced] = useState(false)

    function handleCheckout() {
        setOrderPlaced(true)
        clearCart()
    }

    return (
        <div className="my-5">

            <Header
                title="Shopping Cart"
                description="Review and manage your selected beauty products"
            />

            {orderPlaced && (
                <OrderSuccess
                    onClose={() => setOrderPlaced(false)}
                />
            )}

            {cartItems.length === 0 && !orderPlaced && (
                <EmptyCart />
            )}

            {cartItems.length > 0 && (
                <div className="row g-4 align-items-start">

                    <CartItems />

                    <OrderSummary
                        onCheckout={handleCheckout}
                    />

                </div>
            )}

        </div>
    )
}