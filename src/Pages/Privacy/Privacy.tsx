import LegalPage from '../../Components/LegalPage/LegalPage'
import type { LegalSection } from '../../Components/LegalPage/LegalPage'

const sections: LegalSection[] = [
    {
        heading: '1. Information We Collect',
        list: [
            'Account details: your name, email address, and password (stored securely, never in plain text).',
            'Order details: delivery address, phone number, and the products you order.',
            'Usage data: basic information such as pages visited, device type, and browser, to help us improve the site.',
            'Saved preferences: shades and items you save to your account.',
        ],
    },
    {
        heading: '2. How We Use Your Information',
        list: [
            'To create and manage your account and keep you signed in.',
            'To process, ship, and support your orders.',
            'To show your saved shades and order history.',
            'To improve our store, fix problems, and prevent fraud or abuse.',
        ],
    },
    {
        heading: '3. "Keep me signed in"',
        text: "If you choose to stay signed in, we store a session token in your browser so you don't have to log in each time. Only use this option on devices you trust. You can sign out at any time to remove it.",
    },
    {
        heading: '4. Cookies and Local Storage',
        text: 'We use cookies and browser storage for sign-in sessions and basic site functionality. You can clear or block them in your browser settings, but some features may stop working.',
    },
    {
        heading: '5. Sharing Your Information',
        text: 'We do not sell your personal data. We only share it with service providers needed to run the store (for example hosting, payment, and delivery partners), or when required by law.',
    },
    {
        heading: '6. Data Security',
        text: 'We take reasonable steps to protect your information, but no online system is completely secure. Please use a strong, unique password.',
    },
    {
        heading: '7. Your Rights',
        text: 'You may request access to, correction of, or deletion of your personal data at any time by contacting us.',
    },
    {
        heading: "8. Children's Privacy",
        text: 'HAGORA is not intended for children under 13, and we do not knowingly collect their data.',
    },
    {
        heading: '9. Changes to This Policy',
        text: 'We may update this policy occasionally. The date at the top shows when it was last changed.',
    },
    {
        heading: '10. Contact Us',
        text: 'For privacy questions or requests, email support@hagora.example.',
    },
]

export default function Privacy() {
    return (
        <LegalPage
            title="Privacy Policy"
            updated="October 26, 2026"
            intro="Your privacy matters to us. This policy explains what information HAGORA collects, how we use it, and the choices you have."
            sections={sections}
            otherLink={{ to: '/terms', label: 'Terms of Service' }}
        />
    )
}