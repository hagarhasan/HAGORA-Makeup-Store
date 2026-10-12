import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../../Context/CartContext'

export default function FeaturedBestsellers({ products }) {

    const { addToCart } = useCart()
    const [addedId, setAddedId] = useState(null)

    const bestsellers = products
        .filter(product => product.price && Number(product.price) > 0)
        .slice(20, 24)

    function handleAddToCart(product) {
        addToCart(product)
        setAddedId(product.id)

        setTimeout(() => {
            setAddedId(null)
        }, 1500)
    }

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

            <div className="row g-4">

                {bestsellers.map((product) => (

                    <div
                        className="col-12 col-sm-6 col-lg-3"
                        key={product.id}
                    >

                        <div className="hagora-card-product p-3 h-100">

                            <Link
                                to={`/products/${product.id}`}
                                className="text-decoration-none"
                            >
                                <div className="hagora-product-img-box mb-3">

                                    <img
                                        src={product.image_link}
                                        alt={product.name}
                                        className="hagora-product-img"
                                    />

                                </div>
                            </Link>

                            <div className="d-flex justify-content-between align-items-center mb-1">

                                <small
                                    className="text-uppercase fw-semibold"
                                    style={{
                                        color: '#c2185b',
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    {product.product_type || 'Beauty'}
                                </small>

                                <div className="small text-warning">
                                    <i className="fa-solid fa-star"></i>
                                    <span className="ms-1 text-dark fw-semibold">
                                        4.8
                                    </span>
                                    <span className="text-muted ms-1">
                                        (120)
                                    </span>
                                </div>

                            </div>

                            <h6
                                className="fw-bold text-truncate mb-2"
                                title={product.name}
                            >
                                {product.name}
                            </h6>

                            <div className="mt-auto pt-2 d-flex align-items-center justify-content-between border-top">

                                <span
                                    className="fw-bold fs-5"
                                    style={{ color: '#c2185b' }}
                                >
                                    ${product.price}
                                </span>

                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="btn btn-sm rounded-pill px-3 py-2 fw-semibold text-white"
                                    style={{
                                        backgroundColor:
                                            addedId === product.id
                                                ? '#2e7d32'
                                                : '#c2185b'
                                    }}
                                >
                                    {addedId === product.id ? (
                                        <>
                                            <i className="fa-solid fa-check me-1"></i>
                                            Added
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-bag-shopping me-1"></i>
                                            Add
                                        </>
                                    )}
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

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