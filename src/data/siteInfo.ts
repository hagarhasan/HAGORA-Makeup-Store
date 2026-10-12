export interface SocialLink {
    label: string
    icon: string
    href: string
}

export interface SiteInfo {
    name: string
    email: string
    phone: string
    phoneHref: string
    location: string
    socials: SocialLink[]
}

// One source of truth for Footer, ContactInfo, etc.
export const SITE: SiteInfo = {
    name: 'HAGORA',
    email: 'support@hagora.com',
    phone: '+20 100 000 0000',
    phoneHref: 'tel:+201000000000',
    location: 'Egypt',
    socials: [
        { label: 'GitHub', icon: 'fa-github', href: 'https://github.com/hagarhasan' },
        {
            label: 'LinkedIn',
            icon: 'fa-linkedin-in',
            href: 'https://www.linkedin.com/in/hagar-hassan-marzouk-front-end/',
        },
    ],
}