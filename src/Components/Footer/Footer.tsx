import React from 'react'
import { Link } from 'react-router-dom'
import { SITE } from '../../data/siteInfo'
import styles from './Footer.module.css'

const EXPLORE = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About us', path: '/about' },
    { name: 'Contact', path: '/contact' },
]

const SERVICES = [
    { icon: 'fa-truck', text: 'Fast delivery' },
    { icon: 'fa-rotate-left', text: 'Easy returns' },
    { icon: 'fa-headset', text: 'Customer support' },
]

export default function Footer(): React.JSX.Element {
    return (
        <footer className={styles.footer}>
            <div className="mx-auto w-full max-w-7xl px-4">
                <div className={styles.grid}>
                    <div className={styles.brand}>
                        <Link to="/" className={styles.logo} aria-label="HAGORA home">
                            HAGORA
                        </Link>

                        <p className={styles.description}>
                            Discover your beauty with HAGORA. Find your favorite
                            makeup and beauty products in one place.
                        </p>

                        <div className={styles.socials}>
                            {SITE.socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                >
                                    <i className={`fa-brands ${s.icon}`} aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <nav aria-label="Footer">
                        <h2 className={styles.title}>Explore</h2>
                        <ul className={styles.list}>
                            {EXPLORE.map((l) => (
                                <li key={l.path}>
                                    <Link to={l.path} className={styles.link}>{l.name}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <h2 className={styles.title}>Our services</h2>
                        <ul className={styles.list}>
                            {SERVICES.map((s) => (
                                <li key={s.text} className={styles.row}>
                                    <i className={`fa-solid ${s.icon}`} aria-hidden="true" />
                                    <span>{s.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className={styles.title}>Get in touch</h2>
                        <ul className={styles.list}>
                            <li>
                                <a href={`mailto:${SITE.email}`} className={`${styles.row} ${styles.link}`}>
                                    <i className="fa-solid fa-envelope" aria-hidden="true" />
                                    <span>{SITE.email}</span>
                                </a>
                            </li>
                            <li>
                                <a href={SITE.phoneHref} className={`${styles.row} ${styles.link}`}>
                                    <i className="fa-solid fa-phone" aria-hidden="true" />
                                    <span>{SITE.phone}</span>
                                </a>
                            </li>
                            <li className={styles.row}>
                                <i className="fa-solid fa-location-dot" aria-hidden="true" />
                                <span>{SITE.location}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© {new Date().getFullYear()} HAGORA. All rights reserved.</p>
                    <p>
                        Made with{' '}
                        <span className={styles.heart} role="img" aria-label="love">♥</span>{' '}
                        for beauty
                    </p>
                </div>
            </div>
        </footer>
    )
}