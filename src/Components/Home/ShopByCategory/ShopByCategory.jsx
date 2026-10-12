import React from 'react'
import { Link } from 'react-router-dom'

export default function ShopByCategory({ products }) {

    const categories = [
        {
            type: 'lipstick',
            product: products.find(
                product => product.product_type?.toLowerCase() === 'lipstick'
            )
        },
        {
            type: 'foundation',
            product: products.find(
                product => product.product_type?.toLowerCase() === 'foundation'
            )
        },
        {
            type: 'blush',
            product: products.find(
                product => product.product_type?.toLowerCase() === 'blush'
            )
        },
        {
            type: 'eyeshadow',
            product: products.find(
                product => product.product_type?.toLowerCase() === 'eyeshadow'
            )
        }
    ]

    return (
        <section className="py-5">

            <div className="d-flex justify-content-between align-items-end mb-4">

                <div>
                    <p
                        className="fw-semibold text-uppercase mb-1"
                        style={{
                            color: '#c2185b',
                            letterSpacing: '2px'
                        }}
                    >
                        Explore Our Collection
                    </p>

                    <h2 className="fw-bold mb-0">
                        Shop By Category
                    </h2>
                </div>

                <Link
                    to="/products"
                    className="text-decoration-none fw-semibold d-none d-sm-inline-flex align-items-center gap-1"
                    style={{ color: '#c2185b' }}
                >
                    <span>View All</span>
                    <i className="fa-solid fa-angle-right"></i>
                </Link>

            </div>

            <div className="row g-4">

                {categories.map((category, index) => {

                    if (!category.product) {
                        return null
                    }

                    return (
                        <div
                            className="col-6 col-md-3"
                            key={index}
                        >

                            <Link
                                to={`/products/${category.product.id}`}
                                className="text-decoration-none text-dark"
                            >

                                <div className="hagora-category-card p-3 text-center">

                                    <div className="hagora-category-img-box mb-3">

                                        <img
                                            src={category.product.image_link}
                                            alt={category.product.name}
                                            className="hagora-category-img"
                                        />

                                    </div>

                                    <h6 className="fw-bold mb-1">
                                        {category.product.name}
                                    </h6>

                                    <p
                                        className="text-muted small mb-0"
                                    >
                                        {category.product.brand || 'HAGORA'}
                                    </p>

                                </div>

                            </Link>

                        </div>
                    )
                })}

            </div>

        </section>
    )
}