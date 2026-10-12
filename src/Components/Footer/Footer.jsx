import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {

    return (
        <footer className={styles.footer}>

            <div className="container py-5">

                <div className="row g-5">

                    <div className="col-lg-4 col-md-6">

                        <Link
                            to="/"
                            className={styles.logo}
                            aria-label="HAGORA home"
                        >
                            <span className={styles.brandMark}>H</span>
                            <span className={styles.brandRose} aria-hidden="true">✿</span>
                        </Link>

                        <p className={styles.description}>
                            Discover your beauty with HAGORA.
                            Find your favorite makeup and beauty products
                            in one place.
                        </p>

                        <div className={styles.socials}>

                            <a
                                href="https://github.com/hagarhasan"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="GitHub"
                            >
                                <i className="fa-brands fa-github"></i>
                            </a>

                            <a
                                href="https://www.linkedin.com/in/hagar-hassan-marzouk-front-end/"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                            >
                                <i className="fa-brands fa-linkedin-in"></i>
                            </a>

                        </div>

                    </div>

                    <div className="col-lg-2 col-md-6">

                        <h5 className={styles.title}>
                            Explore
                        </h5>

                        <div className={styles.links}>

                            <Link to="/">
                                Home
                            </Link>

                            <Link to="/products">
                                Products
                            </Link>

                            <Link to="/about">
                                About Us
                            </Link>

                            <Link to="/contact">
                                Contact
                            </Link>

                        </div>

                    </div>

                    <div className="col-lg-3 col-md-6">

                        <h5 className={styles.title}>
                            Our Services
                        </h5>

                        <div className={styles.infoList}>

                            <div>
                                <i className="fa-solid fa-truck"></i>
                                <span>Fast Delivery</span>
                            </div>

                            <div>
                                <i className="fa-solid fa-rotate-left"></i>
                                <span>Easy Returns</span>
                            </div>

                            <div>
                                <i className="fa-solid fa-headset"></i>
                                <span>Customer Support</span>
                            </div>

                        </div>

                    </div>

                    <div className="col-lg-3 col-md-6">

                        <h5 className={styles.title}>
                            Get In Touch
                        </h5>

                        <div className={styles.contactInfo}>

                            <p>
                                <i className="fa-solid fa-envelope"></i>
                                <span>support@hagora.com</span>
                            </p>

                            <p>
                                <i className="fa-solid fa-phone"></i>
                                <span>+20 100 000 0000</span>
                            </p>

                            <p>
                                <i className="fa-solid fa-location-dot"></i>
                                <span>Egypt</span>
                            </p>

                        </div>

                    </div>

                </div>

                <div className={styles.bottom}>

                    <p>
                        © 2026 HAGORA. All rights reserved.
                    </p>

                    <p>
                        Made with{' '}
                        <span>♥</span>{' '}
                        for beauty
                    </p>

                </div>

            </div>

        </footer>
    )
}

