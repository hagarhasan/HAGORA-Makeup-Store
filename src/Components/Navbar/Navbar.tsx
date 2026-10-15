
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../Context/useCart'
import { useAuthContext } from '../../Context/useAuthContext'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import styles from './Navbar.module.css'

interface NavItem {
    name: string
    path: string
    icon: string
}

const LINKS: NavItem[] = [
    { name: 'Home', path: '/', icon: 'fa-house' },
    { name: 'Products', path: '/products', icon: 'fa-bag-shopping' },
    { name: 'About', path: '/about', icon: 'fa-circle-info' },
    { name: 'Contact', path: '/contact', icon: 'fa-envelope' },
]

const ACCOUNT_LINKS: NavItem[] = [
    { name: 'My Profile', path: '/dashboard/profile', icon: 'fa-user' },
    { name: 'My Orders', path: '/dashboard/orders', icon: 'fa-box-open' },
    { name: 'Settings', path: '/dashboard/settings', icon: 'fa-gear' },
]

export default function Navbar(): React.JSX.Element {
    const { totalItems } = useCart()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { user, isAuthenticated, logout } = useAuthContext()

    const [openPath, setOpenPath] = useState<string | null>(null)
    const [accountOpen, setAccountOpen] = useState(false)
    const [prevPathname, setPrevPathname] = useState(pathname)
    const accountRef = useRef<HTMLDivElement>(null)

    if (pathname !== prevPathname) {
        setPrevPathname(pathname)
        setOpenPath(null)
        setAccountOpen(false)
    }

    const menuOpen = openPath === pathname
    const isActive = (path: string) =>
        path === '/' ? pathname === '/' : pathname.startsWith(path)

    const isCartVisible = totalItems > 0 && pathname !== '/cart'
    const isSearchVisible = pathname !== '/search'

    useEffect(() => {
        if (!accountOpen) return

        const handlePointerDown = (event: PointerEvent) => {
            if (
                accountRef.current &&
                !accountRef.current.contains(event.target as Node)
            ) {
                setAccountOpen(false)
            }
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setAccountOpen(false)
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [accountOpen])

    const closeMobileMenu = () => setOpenPath(null)

    const handleLogout = () => {
        logout()
        setAccountOpen(false)
        closeMobileMenu()
        navigate('/login', { replace: true })
    }

    const displayName = user
        ? `${user.username} `.trim() || user.email
        : 'My Account'

    const cartLabel =
        totalItems > 0
            ? `Cart, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`
            : 'Cart'

    return (
        <>
            <header className={styles.navbar}>
                <nav
                    className="mx-auto w-full max-w-7xl px-4"
                    aria-label="Main"
                >
                    <div className={styles.inner}>
                        <Link to="/" className={styles.logo}>
                            HAGORA
                            <span className={styles.flower} aria-hidden="true">
                                ✿
                            </span>
                        </Link>

                        <div className={styles.desktopLinks}>
                            {LINKS.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    aria-current={
                                        isActive(link.path) ? 'page' : undefined
                                    }
                                    className={`${styles.navLink} ${isActive(link.path) ? styles.active : ''
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <ThemeToggle />

                            <Link
                                to="/search"
                                className={`${styles.iconButton} ${styles.hideOnMobile} ${isSearchVisible
                                    ? styles.actionVisible
                                    : styles.actionHidden
                                    }`}
                                aria-label="Search"
                            >
                                <i
                                    className="fa-solid fa-magnifying-glass"
                                    aria-hidden="true"
                                />
                            </Link>

                            <Link
                                to="/cart"
                                className={`${styles.iconButton} ${styles.cartButton
                                    } ${styles.hideOnMobile} ${isCartVisible
                                        ? styles.actionVisible
                                        : styles.actionHidden
                                    }`}
                                aria-label={cartLabel}
                            >
                                <i
                                    className="fa-solid fa-bag-shopping"
                                    aria-hidden="true"
                                />
                                {totalItems > 0 && (
                                    <span
                                        className={styles.badge}
                                        aria-hidden="true"
                                    >
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </span>
                                )}
                            </Link>

                            {isAuthenticated ? (
                                <div
                                    className={`${styles.account} ${styles.hideOnMobile}`}
                                    ref={accountRef}
                                >
                                    <button
                                        type="button"
                                        className={styles.accountButton}
                                        onClick={() =>
                                            setAccountOpen((current) => !current)
                                        }
                                        aria-expanded={accountOpen}
                                        aria-haspopup="menu"
                                    >
                                        <i
                                            className="fa-regular fa-user"
                                            aria-hidden="true"
                                        />
                                        <span className={styles.accountName}>
                                            {displayName}
                                        </span>
                                        <i
                                            className={`fa-solid fa-chevron-down ${accountOpen ? styles.rotated : ''
                                                }`}
                                            aria-hidden="true"
                                        />
                                    </button>

                                    {accountOpen && (
                                        <div
                                            className={styles.accountMenu}
                                            role="menu"
                                        >
                                            <div className={styles.accountInfo}>
                                                <span className={styles.accountGreeting}>
                                                    Signed in as
                                                </span>
                                                <span className={styles.accountEmail}>
                                                    {user?.email}
                                                </span>
                                            </div>

                                            {ACCOUNT_LINKS.map((link) => (
                                                <Link
                                                    key={link.path}
                                                    to={link.path}
                                                    role="menuitem"
                                                    className={styles.accountLink}
                                                    onClick={() =>
                                                        setAccountOpen(false)
                                                    }
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}

                                            <button
                                                type="button"
                                                role="menuitem"
                                                className={styles.logoutButton}
                                                onClick={handleLogout}
                                            >
                                                <i
                                                    className="fa-solid fa-right-from-bracket"
                                                    aria-hidden="true"
                                                />
                                                Sign Out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={`${styles.authActions} ${styles.hideOnMobile}`}>
                                    <Link
                                        to="/login"
                                        className={styles.loginLink}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className={styles.registerLink}
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}

                            <button
                                type="button"
                                className={`${styles.iconButton} ${styles.menuButton}`}
                                onClick={() =>
                                    setOpenPath(menuOpen ? null : pathname)
                                }
                                aria-label={
                                    menuOpen ? 'Close menu' : 'Open menu'
                                }
                                aria-expanded={menuOpen}
                                aria-controls="mobile-menu"
                            >
                                <i
                                    className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'
                                        }`}
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                </nav>
            </header>

            <div
                className={`${styles.mobileMenuOverlay} ${menuOpen ? styles.open : ''}`}
                onClick={closeMobileMenu}
                aria-hidden="true"
            />

            <div
                id="mobile-menu"
                className={`${styles.mobileMenuDrawer} ${menuOpen ? styles.open : ''}`}
            >
                <div className={styles.drawerHeader}>
                    <span className={styles.drawerLogo}>
                        HAGORA<span className={styles.flower}>✿</span>
                    </span>
                    <button
                        className={styles.drawerClose}
                        onClick={closeMobileMenu}
                        aria-label="Close menu"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div className={styles.mobileInner}>
                    <div className={styles.mobileNavLinks}>
                        {LINKS.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                aria-current={
                                    isActive(link.path) ? 'page' : undefined
                                }
                                className={`${styles.mobileLink} ${isActive(link.path) ? styles.active : ''
                                    }`}
                                onClick={closeMobileMenu}
                            >
                                <i className={`fa-solid ${link.icon} ${styles.mobileIcon}`} aria-hidden="true" />
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className={styles.mobileBottomSection}>
                        <ThemeToggle variant="row" className="mb-3" />

                        {isAuthenticated ? (
                            <>
                                <div className={styles.mobileAccountHeading}>
                                    {displayName}
                                </div>
                                {ACCOUNT_LINKS.map((link) => (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={styles.mobileAccountLink}
                                        onClick={closeMobileMenu}
                                    >
                                        <i className={`fa-solid ${link.icon} ${styles.mobileIcon}`} aria-hidden="true" />
                                        {link.name}
                                    </Link>
                                ))}
                                <button
                                    type="button"
                                    className={styles.mobileLogout}
                                    onClick={handleLogout}
                                >
                                    <i className="fa-solid fa-right-from-bracket" aria-hidden="true" style={{ marginRight: '8px' }} />
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className={styles.mobileAuth}>
                                <Link
                                    to="/login"
                                    className={styles.mobileLoginBtn}
                                    onClick={closeMobileMenu}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className={styles.mobileRegisterBtn}
                                    onClick={closeMobileMenu}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}