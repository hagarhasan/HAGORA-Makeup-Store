import React from 'react'
import { Link } from 'react-router-dom'
import AnimatedStats from '../AnimatedStats/AnimatedStats'
import heroImg from '../../assets/hagora_hero.jpeg'
import styles from './Hero.module.css'
import type { Product } from '../../types/product'

interface HeroProps {
    badgeText?: string
    title?: string
    highlight?: string
    description?: string
    primaryText?: string
    primaryLink?: string
    secondaryText?: string
    secondaryLink?: string
    showRating?: boolean
    showStats?: boolean
    products?: Product[]
    heroImage?: string
}

export default function Hero({
    badgeText = 'Beauty collection',
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
    heroImage = heroImg,
}: HeroProps): React.JSX.Element {
    return (
        <section className={styles.hero}>
            <div className={styles.content}>
                <span className={styles.badge}>
                    <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
                    {badgeText}
                </span>

                <h1 className={styles.title}>
                    {title}
                    <span>{highlight}</span>
                </h1>

                <p className={styles.description}>{description}</p>

                <div className={styles.actions}>
                    <Link to={primaryLink} className={styles.primaryButton}>
                        {primaryText}
                    </Link>

                    {secondaryText && (
                        <Link to={secondaryLink} className={styles.secondaryButton}>
                            {secondaryText}
                        </Link>
                    )}
                </div>

                {showStats && <AnimatedStats products={products} variant="hero" />}
            </div>

            <div className={styles.visual}>
                <img
                    src={heroImage}
                    alt="HAGORA makeup collection"
                    className={styles.image}
                    decoding="async"
                />

                <div className={`${styles.card} ${styles.topCard}`}>
                    <span className={styles.cardIcon} aria-hidden="true">
                        <i className="fa-solid fa-palette" />
                    </span>
                    <div>
                        <strong>Beauty picks</strong>
                        <small>Discover your favorites</small>
                    </div>
                </div>

                {showRating && (
                    <div className={`${styles.card} ${styles.bottomCard}`}>
                        <span className={styles.stars} aria-hidden="true">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <i key={i} className="fa-solid fa-star" />
                            ))}
                        </span>
                        <strong>4.9 customer rating</strong>
                    </div>
                )}
            </div>
        </section>
    )
}