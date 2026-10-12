import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../../Context/CartContext'
import CartItem from '../CartItem/CartItem'

export default function CartItems() {

    const {
        cartItems,
        clearCart
    } = useCart()

    const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    )

    return (
        <div className="col-lg-8">

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h5 className="fw-bold mb-0">
                    Bag Items ({totalItems})
                </h5>

                <button
                    onClick={clearCart}
                    className="btn btn-outline-danger btn-sm rounded-pill px-3"
                >
                    <i className="fa-regular fa-trash-can me-1"></i>
                    Clear Bag
                </button>

            </div>

            {cartItems.map((item) => (
                <CartItem
                    key={item.id}
                    item={item}
                />
            ))}

            <div className="mt-4">

                <Link
                    to="/products"
                    className="text-decoration-none fw-semibold d-inline-flex align-items-center gap-2"
                    style={{ color: '#c2185b' }}
                >
                    <i className="fa-solid fa-arrow-left"></i>
                    <span>Continue Shopping</span>
                </Link>

            </div>

        </div>
    )
}