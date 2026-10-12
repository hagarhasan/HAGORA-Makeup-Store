import React from 'react'
import styles from './ContactHeader.module.css'

export default function ContactHeader() {
    return (
        <section className={styles.header}>

            <span className={styles.label}>
                CONTACT HAGORA
            </span>

            <h1>
                We'd love to hear from you.
            </h1>

            <p>
                Have a question about our products or your order?
                We're here to help.
            </p>

        </section>
    )
}

