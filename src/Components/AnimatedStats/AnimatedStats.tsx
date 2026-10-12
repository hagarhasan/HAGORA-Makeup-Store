import React, { useEffect, useRef, useState } from 'react'
import styles from './AnimatedStats.module.css'
import type { Product } from '../../types/product'

export default function AnimatedStats({ products = [], variant = 'about' }: { products?: Product[]; variant?: string }) {
    const [counts, setCounts] = useState({
        products: 0,
        brands: 0
    })

    const sectionRef = useRef(null)
    const startedRef = useRef(false)

    const productCount = products.length
    const brandCount = new Set(
        products
            .map(product => product.brand)
            .filter(Boolean)
    ).size

    useEffect(() => {
        if (!productCount) {
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !startedRef.current) {
                    startedRef.current = true

                    const duration = 1500
                    const startTime = performance.now()

                    function animate(currentTime: number) {
                        const progress = Math.min(
                            (currentTime - startTime) / duration,
                            1
                        )

                        setCounts({
                            products: Math.floor(progress * productCount),
                            brands: Math.floor(progress * brandCount)
                        })

                        if (progress < 1) {
                            requestAnimationFrame(animate)
                        }
                    }

                    requestAnimationFrame(animate)
                }
            },
            { threshold: 0.3 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [productCount, brandCount])

    const isHero = variant === 'hero'

    const stats = isHero
        ? [
            { number: `${counts.products}+`, label: 'Products' },
            { number: `${counts.brands}+`, label: 'Brands' }
        ]
        : [
            { number: `${counts.products}+`, label: 'Beauty Products' },
            { number: `${counts.brands}+`, label: 'Beauty Brands' },
            { number: '24/7', label: 'Shopping Experience' },
            { number: '100%', label: 'Beauty Focused' }
        ]

    return (
        <section
            ref={sectionRef}
            className={`${styles.stats} ${styles[variant] || ''}`}
        >
            <div className={isHero ? 'row g-4' : 'row text-center g-4'}>
                {stats.map((stat, index) => (
                    <div
                        className={
                            isHero
                                ? 'col-6'
                                : 'col-6 col-md-3'
                        }
                        key={index}
                    >
                        <div className={styles.stat}>
                            <h3>{stat.number}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
