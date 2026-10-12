import React from 'react'
import styles from './ContactInfo.module.css'

export default function ContactInfo() {

    const contactInfo = [
        {
            icon: 'fa-envelope',
            title: 'Email',
            text: 'support@hagora.com'
        },
        {
            icon: 'fa-phone',
            title: 'Phone',
            text: '+20 100 000 0000'
        },
        {
            icon: 'fa-location-dot',
            title: 'Location',
            text: 'Egypt'
        }
    ]

    return (
        <section className={styles.infoSection}>

            <span className={styles.smallLabel}>
                LET'S TALK
            </span>

            <h2>
                How can we help?
            </h2>

            <p className={styles.description}>
                Whether you have a question about a product,
                an order or anything else, feel free to reach out.
            </p>

            <div className={styles.infoList}>

                {contactInfo.map((item, index) => (

                    <div
                        className={styles.infoItem}
                        key={index}
                    >

                        <div className={styles.icon}>
                            <i className={`fa-solid ${item.icon}`}></i>
                        </div>

                        <div>
                            <h6>
                                {item.title}
                            </h6>

                            <p>
                                {item.text}
                            </p>
                        </div>

                    </div>

                ))}

            </div>

            <div className={styles.socials}>

                <span>
                    Follow HAGORA
                </span>

                <div className={styles.socialLinks}>

                    <a href="#">
                        <i className="fa-brands fa-instagram"></i>
                    </a>

                    <a href="#">
                        <i className="fa-brands fa-facebook-f"></i>
                    </a>

                    <a href="#">
                        <i className="fa-brands fa-tiktok"></i>
                    </a>

                </div>

            </div>

        </section>
    )
}

