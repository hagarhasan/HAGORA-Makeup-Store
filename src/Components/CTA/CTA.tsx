import React from 'react'
import { Link } from 'react-router-dom'
import styles from './CTA.module.css'

export default function CTA({
    label = 'YOUR BEAUTY JOURNEY',
    title = 'Ready to discover your next favorite?',
    description = 'Explore our collection and find something made for your beauty routine.',
    buttonText = 'Shop Now',
    buttonLink = '/products'
}) {
    return (
        <section className={styles.cta}>

            <div className="text-center">

                <span className={styles.label}>
                    {label}
                </span>

                <h2>
                    {title}
                </h2>

                <p>
                    {description}
                </p>

                <Link
                    to={buttonLink}
                    className={`${styles.button} mt-3`}
                >
                    {buttonText}
                    <i className="fa-solid fa-arrow-right ms-2"></i>
                </Link>

            </div>

        </section>
    )
}