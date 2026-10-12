import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import styles from './Contact.module.css'
import ContactHeader from '../../Components/Contact/ContactHeader/ContactHeader'
import ContactInfo from '../../Components/Contact/ContactInfo/ContactInfo'
import ContactForm from '../../Components/Contact/ContactForm/ContactForm'

export default function Contact(): React.JSX.Element {
    // Page background lives on <body> so it covers the full screen,
    // not just the Layout's max-w-7xl wrapper. Removed when leaving the page.
    useEffect(() => {
        document.body.classList.add(styles.pageBg)
        return () => document.body.classList.remove(styles.pageBg)
    }, [])

    return (
        <div className={styles.contact}>
            <Helmet>
                <title>Contact - HAGORA</title>
                <meta name="description" content="Contact HAGORA about your order, our products or anything else." />
                <meta name="keywords" content="Contact, HAGORA, Support" />
                <meta name="author" content="HAGORA" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Helmet>

            <ContactHeader />

            <div className={styles.grid}>
                <ContactInfo />
                <ContactForm />
            </div>
        </div>
    )
}