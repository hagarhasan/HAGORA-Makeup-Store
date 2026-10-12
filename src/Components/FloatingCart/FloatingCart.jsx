import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../Context/CartContext'
import styles from './FloatingCart.module.css'

export default function FloatingCart() {

    const { totalItems } = useCart()
    const location = useLocation()

    if (totalItems === 0 || location.pathname === '/cart') {
        return null
    }

    return (
        <Link
            to="/cart"
            className={styles.floatingCart}
        >
            <i className="fa-solid fa-bag-shopping"></i>

            <span className={styles.badge}>
                {totalItems}
            </span>
        </Link>
    )
}

