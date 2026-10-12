import React from 'react'
import { Link } from 'react-router-dom'
import ProductSwiper from '../../ProductSwiper/ProductSwiper'
import type { Product } from '../../../types/product'

export default function FeaturedBestsellers({
    products
}: {
    products: Product[]
}) {
    const bestsellers = products
        .filter(
            product =>
                product.price &&
                Number(product.price) > 0
        )
        .slice(0, 8)

    return (
        <section className="py-5">
            <div className="text-center mb-5">
                <span className="hagora-badge-pill mb-2 d-inline-block">
                    CURATED PICKS
                </span>

                <h2 className="fw-bold">
                    Our Most-Loved Bestsellers
                </h2>

                <p
                    className="text-secondary mx-auto"
                    style={{ maxWidth: '560px' }}
                >
                    Discover some of our favorite beauty products.
                </p>
            </div>

            <div className="mt-4">
                <ProductSwiper products={bestsellers} badge="Bestseller" />
            </div>

            <div className="text-center mt-5">
                <Link
                    to="/products"
                    className="btn-hagora-outline"
                >
                    <span>Explore Full Product Catalog</span>
                    <i className="fa-solid fa-arrow-right"></i>
                </Link>
            </div>
        </section>
    )
}