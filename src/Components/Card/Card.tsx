import React, { useState } from 'react'

import { Link } from 'react-router-dom'

import { useCart } from '../../Context/useCart'
import { useAuthContext } from '../../Context/useAuthContext'

import LoginRequiredModal from '../Auth/LoginRequiredModal/LoginRequiredModal'

import placeholderImg from '../../assets/placeholder.svg'

import type { SyntheticEvent } from 'react'
import type { Product } from '../../types/product'

interface CardProps {
    product: Product
    badge?: string | null
}

export default function Card({ product, badge }: CardProps) {
    const {
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartItems
    } = useCart()

    const { isAuthenticated } = useAuthContext()

    const [added, setAdded] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)

    const productPrice = Number(product.price)

    const isPriceAvailable =
        !isNaN(productPrice) && productPrice > 0

    const cartProduct = cartItems.find(
        item => item.id === product.id
    )

    const isInCart = !!cartProduct
    const quantity = cartProduct?.quantity || 0

    const handleImageError = (
        e: SyntheticEvent<HTMLImageElement>
    ) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = placeholderImg
    }

    const imageSource =
        product.image_link ||
        product.api_featured_image ||
        placeholderImg

    function handleAddToCart() {
        if (!isPriceAvailable) {
            return
        }

        if (!isAuthenticated) {
            setShowLoginModal(true)
            return
        }

        if (isInCart) {
            return
        }

        addToCart(product)

        setAdded(true)

        setTimeout(() => {
            setAdded(false)
        }, 1200)
    }

    return (
        <>
            <div className="hagora-product-card h-100">
                <div className="card h-100 border-0 rounded-4 overflow-hidden">
                    <div
                        className="hagora-product-image position-relative d-flex align-items-center justify-content-center p-3"
                        style={{
                            height: '260px',
                            backgroundColor: '#fce4ec'
                        }}
                    >
                        {badge && (
                            <span
                                className="position-absolute top-0 start-0 m-3 badge rounded-pill px-3 py-2"
                                style={{
                                    backgroundColor:
                                        badge === 'Bestseller'
                                            ? '#c2185b'
                                            : '#880e4f',
                                    zIndex: 2
                                }}
                            >
                                {badge}
                            </span>
                        )}

                        <img
                            src={imageSource}
                            onError={handleImageError}
                            alt={product.name}
                            className="img-fluid hagora-product-img"
                            style={{
                                maxHeight: '230px',
                                objectFit: 'contain'
                            }}
                        />

                        {isInCart && (
                            <div className="hagora-cart-overlay">
                                <div className="hagora-quantity-box">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            decreaseQuantity(product.id)
                                        }}
                                        className="hagora-quantity-btn"
                                    >
                                        <i className="fa-solid fa-minus"></i>
                                    </button>

                                    <span className="hagora-quantity">
                                        {quantity}
                                    </span>

                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            increaseQuantity(product.id)
                                        }}
                                        className="hagora-quantity-btn"
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        removeFromCart(product.id)
                                    }}
                                    className="hagora-remove-btn"
                                >
                                    <i className="fa-solid fa-trash-can me-2"></i>
                                    Remove from Bag
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="card-body p-4 d-flex flex-column">
                        <small
                            className="fw-semibold text-uppercase mb-2"
                            style={{
                                color: '#c2185b',
                                letterSpacing: '1px'
                            }}
                        >
                            {product.brand || 'Beauty'}
                        </small>

                        <h5 className="card-title fw-bold mb-2 text-truncate">
                            {product.name}
                        </h5>

                        <h6
                            className="fw-bold mb-3"
                            style={{
                                color: isPriceAvailable
                                    ? '#c2185b'
                                    : '#999'
                            }}
                        >
                            {isPriceAvailable
                                ? `$${productPrice.toFixed(2)}`
                                : 'Price unavailable'}
                        </h6>

                        <div className="d-flex gap-2 mt-auto">
                            <Link
                                to={`/products/${product.id}`}
                                className="btn text-white rounded-pill flex-grow-1 hagora-details-btn"
                                style={{
                                    backgroundColor: '#c2185b'
                                }}
                            >
                                Details

                                <i className="fa-solid fa-arrow-right ms-2"></i>
                            </Link>

                            <button
                                onClick={handleAddToCart}
                                disabled={!isPriceAvailable}
                                className="btn rounded-circle d-flex align-items-center justify-content-center hagora-cart-btn"
                                style={{
                                    backgroundColor:
                                        !isPriceAvailable
                                            ? '#e9ecef'
                                            : isInCart || added
                                                ? '#2e7d32'
                                                : '#fce4ec',
                                    color:
                                        !isPriceAvailable
                                            ? '#999'
                                            : isInCart || added
                                                ? '#fff'
                                                : '#c2185b',
                                    width: '38px',
                                    height: '38px',
                                    border: 'none',
                                    flexShrink: 0
                                }}
                                title={
                                    isPriceAvailable
                                        ? 'Add to cart'
                                        : 'Price unavailable'
                                }
                            >
                                <i
                                    className={`fa-solid ${!isPriceAvailable
                                        ? 'fa-ban'
                                        : isInCart || added
                                            ? 'fa-check'
                                            : 'fa-bag-shopping'
                                        }`}
                                ></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showLoginModal && (
                <LoginRequiredModal
                    onClose={() => setShowLoginModal(false)}
                />
            )}
        </>
    )
}
