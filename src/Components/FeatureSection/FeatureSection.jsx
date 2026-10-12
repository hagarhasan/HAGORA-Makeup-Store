import React from 'react'
import styles from './FeatureSection.module.css'
export default function FeatureSection({
    label,
    title,
    description,
    features,
    variant = 'default'
}) {
    return (
        <section className={`${styles.section} ${styles[variant]}`}>

            <div className={styles.header}>

                <span className={styles.label}>
                    {label}
                </span>

                <h2 className={styles.title}>
                    {title}
                </h2>

                {description && (
                    <p className={styles.description}>
                        {description}
                    </p>
                )}

            </div>

            <div className="row g-4">

                {features.map((feature, index) => (

                    <div
                        className="col-md-4"
                        key={index}
                    >

                        <div className={styles.card}>

                            <div className={styles.icon}>
                                <i className={`fa-solid ${feature.icon}`}></i>
                            </div>

                            <h4 className={styles.cardTitle}>
                                {feature.title}
                            </h4>

                            <p className={styles.cardDescription}>
                                {feature.description}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    )
}