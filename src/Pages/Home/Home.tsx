import type { Product } from '../../types/product'
import Hero from '../../Components/Hero/Hero'
import ShopByCategory from '../../Components/Home/ShopByCategory/ShopByCategory'
import FeaturedBestsellers from '../../Components/Home/FeaturedBestsellers/FeaturedBestsellers'
import DiscountBanner from '../../Components/DiscountBanner/DiscountBanner'
import Reviews from '../../Components/Home/Reviews/Reviews'
import Newsletter from '../../Components/Home/Newsletter/Newsletter'
import FeatureSection from '../../Components/FeatureSection/FeatureSection'
import Loading from '../../Components/Loading/Loading'

export default function Home({ products, loading }: { products: Product[], loading: boolean }) {

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="pb-5">
            <Hero
                badgeText="BEAUTY COLLECTION"
                title="Everything You Need"
                highlight="To Feel Beautiful"
                description="Discover makeup and beauty products from brands you love, all in one place."
                primaryText="Shop Now"
                primaryLink="/products"
                secondaryText="About HAGORA"
                secondaryLink="/about"
                showStats={true}
                showRating={true}
                products={products}
            />

            <ShopByCategory products={products} />

            <FeaturedBestsellers products={products} />

            <DiscountBanner />

            <FeatureSection
                label="WHY CHOOSE HAGORA"
                title="Beauty You Can Feel Good About"
                description="Discover makeup and beauty products from brands you love, all in one place."
                features={[
                    {
                        icon: 'fa-gem',
                        title: '100% Authentic Quality',
                        description: 'Quality beauty products from trusted brands.'
                    },
                    {
                        icon: 'fa-truck-fast',
                        title: 'Fast & Easy Delivery',
                        description: 'Get your favorite beauty products delivered to your door.'
                    },
                    {
                        icon: 'fa-heart',
                        title: 'Made for Beauty Lovers',
                        description: 'A collection created to help you find products you love.'
                    }
                ]}
            />

            <Reviews />

            <Newsletter />

        </div>
    )
}