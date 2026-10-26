import LegalPage from '../../Components/LegalPage/LegalPage'
import type { LegalSection } from '../../Components/LegalPage/LegalPage'

const sections: LegalSection[] = [
    {
        heading: '1. About HAGORA',
        text: 'HAGORA is an online makeup store where you can browse shades, save favorites, and place orders for cosmetic products.',
    },
    {
        heading: '2. Your Account',
        text: 'You must provide accurate information when creating an account and keep your password confidential. You are responsible for all activity under your account. Please notify us immediately if you suspect unauthorized use.',
    },
    {
        heading: '3. Orders and Payment',
        text: 'All orders are subject to availability and confirmation. Prices are shown on the site and may change without notice. We may cancel or refuse an order if there is a pricing error, stock issue, or suspected misuse.',
    },
    {
        heading: '4. Shipping and Delivery',
        text: 'Delivery times are estimates, not guarantees. Please make sure your delivery address and phone number are correct at checkout.',
    },
    {
        heading: '5. Returns and Refunds',
        text: 'For hygiene reasons, opened or used cosmetic products cannot be returned. Unopened items in original packaging may be returned within 14 days of delivery. Damaged or incorrect items will be replaced or refunded.',
    },
    {
        heading: '6. Product Information',
        text: 'We try to show shades accurately, but colors may look different depending on your screen. Please check ingredients before use if you have allergies or sensitive skin.',
    },
    {
        heading: '7. Acceptable Use',
        text: 'You agree not to misuse the site, attempt unauthorized access, interfere with its operation, or use it for unlawful purposes.',
    },
    {
        heading: '8. Intellectual Property',
        text: 'All content on this site, including the logo, text, graphics, and design, belongs to HAGORA and may not be copied or reused without permission.',
    },
    {
        heading: '9. Limitation of Liability',
        text: 'HAGORA is provided "as is". To the extent permitted by law, we are not liable for indirect or consequential damages arising from your use of the site or products.',
    },
    {
        heading: '10. Changes to These Terms',
        text: 'We may update these terms from time to time. Continued use of the site after changes means you accept the updated terms.',
    },
    {
        heading: '11. Contact Us',
        text: 'Questions? Email us at support@hagora.example.',
    },
]

export default function Terms() {
    return (
        <LegalPage
            title="Terms of Service"
            updated="October 26, 2026"
            intro="Welcome to HAGORA. By accessing or using this website you agree to these Terms of Service. If you do not agree, please do not use the site."
            sections={sections}
            otherLink={{ to: '/privacy', label: 'Privacy Policy' }}
        />
    )
}