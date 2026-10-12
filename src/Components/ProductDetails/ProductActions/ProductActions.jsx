import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductActions({
    addToCart,
    product,
    isPriceAvailable,
    isInCart,
    quantity,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    added,
    setAdded
}) {

    function handleAddToCart() {
        if (!isPriceAvailable) {
            return
        }

        addToCart(product)
        setAdded(true)

        setTimeout(() => {
            setAdded(false)
        }, 1500)
    }

    if (!isPriceAvailable) {
        return (
            <div className="d-flex gap-3 mt-4">
                <button
                    disabled
                    className="btn btn-secondary rounded-pill px-4 py-3"
                >
                    <i className="fa-solid fa-ban me-2"></i>
                    Unavailable
                </button>

                <Link
                    to="/products"
                    className="btn btn-outline-secondary rounded-pill px-4 py-3"
                >
                    Continue Shopping
                </Link>
            </div>
        )
    }

    return (
        <div className="mt-4">

            {isInCart ? (
                <div className="d-flex align-items-center gap-3 flex-wrap">

                    <div className="d-flex align-items-center gap-3">

                        <button
                            onClick={() =>
                                decreaseQuantity(product.id)
                            }
                            className="btn rounded-circle"
                            style={{
                                width: '45px',
                                height: '45px',
                                backgroundColor: '#fce4ec',
                                color: '#c2185b'
                            }}
                        >
                            <i className="fa-solid fa-minus"></i>
                        </button>

                        <span
                            className="fw-bold fs-5"
                            style={{
                                minWidth: '25px',
                                textAlign: 'center'
                            }}
                        >
                            {quantity}
                        </span>

                        <button
                            onClick={() =>
                                increaseQuantity(product.id)
                            }
                            className="btn rounded-circle"
                            style={{
                                width: '45px',
                                height: '45px',
                                backgroundColor: '#fce4ec',
                                color: '#c2185b'
                            }}
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>

                    </div>

                    <button
                        onClick={() =>
                            removeFromCart(product.id)
                        }
                        className="btn px-4 py-3 rounded-pill"
                        style={{
                            border: '1px solid #c2185b',
                            color: '#c2185b'
                        }}
                    >
                        <i className="fa-solid fa-trash-can me-2"></i>
                        Remove from Bag
                    </button>

                    <Link
                        to="/products"
                        className="btn btn-outline-secondary rounded-pill px-4 py-3"
                    >
                        Continue Shopping
                    </Link>

                </div>
            ) : (
                <div className="d-flex gap-3 flex-wrap">

                    <button
                        onClick={handleAddToCart}
                        className="btn text-white rounded-pill px-4 py-3"
                        style={{
                            backgroundColor: added
                                ? '#2e7d32'
                                : '#c2185b',
                            transition: 'all 0.3s'
                        }}
                    >
                        <i
                            className={`fa-solid ${added
                                    ? 'fa-check'
                                    : 'fa-bag-shopping'
                                } me-2`}
                        ></i>

                        {added
                            ? 'Added to Bag!'
                            : 'Add to Cart'
                        }
                    </button>

                    <Link
                        to="/products"
                        className="btn btn-outline-secondary rounded-pill px-4 py-3"
                    >
                        Continue Shopping
                    </Link>

                </div>
            )}

        </div>
    )
}
