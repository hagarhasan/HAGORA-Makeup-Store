import React from 'react'
import { Link } from 'react-router-dom'
import AnimatedStats from '../AnimatedStats/AnimatedStats'
import heroImg from '../../assets/hagora_hero.jpeg'
import styles from './Hero.module.css'

export default function Hero({
    badgeText = 'BEAUTY COLLECTION',
    title = 'Everything You Need',
    highlight = 'To Feel Beautiful',
    description = 'Discover makeup and beauty products from brands you love, all in one place.',
    primaryText = 'Shop Now',
    primaryLink = '/products',
    secondaryText = 'About HAGORA',
    secondaryLink = '/about',
    showRating = true,
    showStats = false,
    products = [],
    heroImage = heroImg
}) {
    return (
        <section className={styles.hero}>
            <div className="row align-items-center g-5">
                <div className="col-lg-6">
                    <div className={styles.badge}>
                        <i className="fa-solid fa-wand-magic-sparkles"></i>

                        <span>
                            {badgeText}
                        </span>
                    </div>

                    <h1 className={styles.title}>
                        {title}

                        <span>
                            {highlight}
                        </span>
                    </h1>

                    <p className={styles.description}>
                        {description}
                    </p>

                    <div className="d-flex flex-wrap gap-3 mb-4">
                        <Link
                            to={primaryLink}
                            className={styles.primaryButton}
                        >
                            <span>
                                {primaryText}
                            </span>

                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>

                        {secondaryText && (
                            <Link
                                to={secondaryLink}
                                className={styles.secondaryButton}
                            >
                                <span>
                                    {secondaryText}
                                </span>
                            </Link>
                        )}
                    </div>

                    {showStats && (
                        <AnimatedStats products={products} variant="hero" />
                    )}
                </div>

                <div className="col-lg-6">
                    <div className={styles.imageContainer}>
                        <img
                            src={heroImage}
                            alt="HAGORA Makeup Collection"
                            className={styles.image}
                        />

                        <div
                            className={`${styles.floatingBadge} ${styles.topBadge}`}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <span className="fs-4">
                                    💄
                                </span>

                                <div>
                                    <div className="fw-bold small">
                                        Beauty Picks
                                    </div>

                                    <small className="text-muted">
                                        Discover your favorites
                                    </small>
                                </div>
                            </div>
                        </div>

                        {showRating && (
                            <div
                                className={`${styles.floatingBadge} ${styles.bottomBadge}`}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <div className={styles.stars}>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                        <i className="fa-solid fa-star"></i>
                                    </div>

                                    <span className="fw-bold small text-dark">
                                        4.9 Customer Rating
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}