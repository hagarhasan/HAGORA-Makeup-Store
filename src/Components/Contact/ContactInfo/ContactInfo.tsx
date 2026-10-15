import React from 'react'
import styles from './ContactInfo.module.css'

interface InfoItem {
    icon: string
    title: string
    text: string
    href?: string
}

interface SocialLink {
    label: string
    icon: string
    href: string
}

const contactInfo: InfoItem[] = [
    { icon: 'fa-envelope', title: 'Email', text: 'support@hagora.com', href: 'mailto:support@hagora.com' },
    { icon: 'fa-phone', title: 'Phone', text: '+20 100 000 0000', href: 'tel:+201000000000' },
    { icon: 'fa-location-dot', title: 'Location', text: 'Egypt' },
]

// TODO: replace '#' with your real profile links
const socials: SocialLink[] = [
    { label: 'Instagram', icon: 'fa-instagram', href: '#' },
    { label: 'Facebook', icon: 'fa-facebook-f', href: '#' },
    { label: 'TikTok', icon: 'fa-tiktok', href: '#' },
]

export default function ContactInfo(): React.JSX.Element {
    return (
        <section className={`${styles.panel} hagora-contact-panel`} aria-labelledby="contact-info-title">
            <h2 id="contact-info-title">How can we help?</h2>

            <p className={styles.description}>
                Whether you have a question about a product, an order or
                anything else, reach out in whatever way suits you.
            </p>

            <ul className={styles.list}>
                {contactInfo.map((item) => {
                    const content = (
                        <>
                            <span className={styles.icon} aria-hidden="true">
                                <i className={`fa-solid ${item.icon}`} />
                            </span>
                            <span>
                                <span className={styles.itemTitle}>{item.title}</span>
                                <span className={styles.itemText}>{item.text}</span>
                            </span>
                        </>
                    )

                    return (
                        <li key={item.title}>
                            {item.href ? (
                                <a href={item.href} className={`${styles.item} ${styles.link}`}>
                                    {content}
                                </a>
                            ) : (
                                <div className={styles.item}>{content}</div>
                            )}
                        </li>
                    )
                })}
            </ul>

            <div className={styles.socials}>
                <span>Follow HAGORA</span>

                <div className={styles.socialLinks}>
                    {socials.map((s) => (
                        <a
                            key={s.label}
                            href={s.href}
                            aria-label={s.label}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className={`fa-brands ${s.icon}`} aria-hidden="true" />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}