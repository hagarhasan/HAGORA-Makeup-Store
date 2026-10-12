import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../Context/useCart'
import styles from './FloatingSearch.module.css'

export default function FloatingSearch() {
    const location = useLocation()
    const { totalItems } = useCart()

    const isCartVisible = totalItems > 0 && location.pathname !== '/cart'
    const isSearchVisible = location.pathname !== '/search'

    return (
        <Link
            to="/search"
            className={`${styles.floatingSearch} ${isCartVisible ? styles.searchMovedUp : styles.searchMovedDown} ${isSearchVisible ? styles.visible : styles.hidden}`}
        >
            <i className="fa-solid fa-magnifying-glass"></i>
        </Link>
    )
}
