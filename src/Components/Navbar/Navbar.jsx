import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../../Context/CartContext'
import styles from './Navbar.module.css'

export default function Navbar() {

    const { totalItems } = useCart()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ]

    function isActive(path) {
        if (path === '/') {
            return location.pathname === '/'
        }

        return location.pathname.startsWith(path)
    }

    function closeMenu() {
        setMenuOpen(false)
    }

    return (
        <nav className={styles.navbar}>

            <div className="container">

                <div className={styles.navbarInner}>

                    <Link
                        to="/"
                        className={styles.logo}
                        onClick={closeMenu}
                    >
                        HAGORA
                    </Link>

                    <div className={styles.desktopLinks}>
                        {links.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`${styles.navLink} ${isActive(link.path)
                                    ? styles.active
                                    : ''
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className={styles.desktopActions}>

                        <Link
                            to="/search"
                            className={styles.iconButton}
                            aria-label="Search"
                        >
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </Link>

                        <Link
                            to="/cart"
                            className={styles.iconButton}
                            aria-label="Cart"
                        >
                            <i className="fa-solid fa-bag-shopping"></i>

                            {totalItems > 0 && (
                                <span className={styles.badge}>
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                    </div>

                    <div className={styles.mobileActions}>

                        <Link
                            to="/search"
                            className={styles.iconButton}
                        >
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </Link>

                        <Link
                            to="/cart"
                            className={styles.iconButton}
                        >
                            <i className="fa-solid fa-bag-shopping"></i>

                            {totalItems > 0 && (
                                <span className={styles.badge}>
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <button
                            type="button"
                            className={styles.menuButton}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <i
                                className={`fa-solid ${menuOpen
                                    ? 'fa-xmark'
                                    : 'fa-bars'
                                    }`}
                            ></i>
                        </button>

                    </div>

                </div>

                <div
                    className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''
                        }`}
                >
                    {links.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={closeMenu}
                            className={`${styles.mobileLink} ${isActive(link.path)
                                ? styles.mobileActive
                                : ''
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

            </div>

        </nav>
    )
}
