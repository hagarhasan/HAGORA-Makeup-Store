import React from 'react'
import styles from './ContactHeader.module.css'

export default function ContactHeader(): React.JSX.Element {
    return (
        <header className={styles.header}>
            <h1>We'd love to hear from you.</h1>

            <p>
                Have a question about our products or your order?
                Send us a message and we'll get back to you.
            </p>

            <span className={styles.status}>
                <span className={styles.dot} aria-hidden="true" />
                We usually reply within 24 hours
            </span>
        </header>
    )
}