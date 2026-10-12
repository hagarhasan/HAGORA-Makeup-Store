import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../Context/useCart'
import styles from './FloatingCart.module.css'

export default function FloatingCart() {
    const { totalItems } = useCart()
    const location = useLocation()

    // It should be visible if we have items AND we're not on the cart page
    const shouldShow = totalItems > 0 && location.pathname !== '/cart'

    return (
        <Link
            to="/cart"
            className={`${styles.floatingCart} ${shouldShow ? styles.visible : styles.hidden}`}
        >
            <i className="fa-solid fa-bag-shopping"></i>

            {totalItems > 0 && (
                <span className={styles.badge}>
                    {totalItems}
                </span>
            )}
        </Link>
    )
}
