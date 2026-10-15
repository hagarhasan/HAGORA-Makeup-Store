import React from 'react'
import styles from './FeatureSection.module.css'
interface Feature {
    icon: string
    title: string
    description: string
}

interface FeatureSectionProps {
    label: string
    title: string
    description?: string
    features: Feature[]
    variant?: string
}

export default function FeatureSection({
    label,
    title,
    description,
    features,
    variant = 'default'
}: FeatureSectionProps) {
    return (
        <section className={`${styles.section} ${styles[variant]} hagora-feature-section`}>

            <div className={`${styles.header} hagora-feature-header`}>

                <span className={`${styles.label} hagora-feature-label`}>
                    {label}
                </span>

                <h2 className={`${styles.title} hagora-feature-title`}>
                    {title}
                </h2>

                {description && (
                    <p className={`${styles.description} hagora-feature-description`}>
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

                        <div className={`${styles.card} hagora-feature-card`}>

                            <div className={`${styles.icon} hagora-feature-icon`}>
                                <i className={`fa-solid ${feature.icon}`}></i>
                            </div>

                            <h4 className={`${styles.cardTitle} hagora-feature-card-title`}>
                                {feature.title}
                            </h4>

                            <p className={`${styles.cardDescription} hagora-feature-card-description`}>
                                {feature.description}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    )
}