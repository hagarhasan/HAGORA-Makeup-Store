
import React from 'react'
import Hero from '../../Components/Hero/Hero'
import styles from './About.module.css'
import aboutImg from '../../assets/hagora_serum.jpg'
import CTA from '../../Components/CTA/CTA'
import FeatureSection from '../../Components/FeatureSection/FeatureSection'
import AboutStory from '../../Components/ِAbout/AboutStory/AboutStory'
import AboutStats from '../../Components/ِAbout/AboutStats/AboutStats'
import type { Product } from '../../types/product'
import { Helmet } from 'react-helmet-async'
import Loading from '../../Components/Loading/Loading'


export default function About({ products, loading }: { products: Product[], loading: boolean }) {
    if (loading) {
        return (
            <Loading />
        )
    }
    return (
        <>
            <Helmet>
                <title>About - HAGORA</title>
                <meta name="description" content="About HAGORA" />
                <meta name="keywords" content="About, HAGORA" />
                <meta name="author" content="HAGORA" />
            </Helmet>
            <div className={styles.about}>

                <Hero
                    badgeText="OUR STORY"
                    title="Beauty is more than"
                    highlight=" makeup."
                    description="Discover a beauty experience designed around confidence, self-expression and you."
                    primaryText="Explore Collection"
                    primaryLink="/products"
                    secondaryText="Contact Us"
                    secondaryLink="/contact"
                    showStats={false}
                    heroImage={aboutImg}
                />

                <AboutStory />

                <FeatureSection
                    variant="aboutStyle"
                    label="WHAT WE BELIEVE"
                    title="More than just beauty"
                    description="Everything we do is built around making your beauty shopping experience better."
                    features={[
                        {
                            icon: 'fa-gem',
                            title: 'Quality',
                            description: 'Discover carefully selected beauty products made to fit your routine and style.'
                        },
                        {
                            icon: 'fa-heart',
                            title: 'Confidence',
                            description: 'Makeup is a way to express yourself, feel confident and celebrate what makes you unique.'
                        },
                        {
                            icon: 'fa-palette',
                            title: 'Inspiration',
                            description: 'Find new products, discover new looks and make every beauty moment yours.'
                        }
                    ]}
                />

                <AboutStats products={products} />

                <CTA
                    label="YOUR BEAUTY JOURNEY"
                    title="Ready to discover your next favorite?"
                    description="Explore our collection and find something made for your beauty routine."
                    buttonText="Shop Now"
                    buttonLink="/products"
                />
            </div>
        </>
    )
}