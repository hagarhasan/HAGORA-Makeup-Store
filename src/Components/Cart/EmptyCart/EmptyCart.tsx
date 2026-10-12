import React from 'react'
import { Link } from 'react-router-dom'

export default function EmptyCart() {
    return (
        <div className="text-center py-5 my-4 bg-white rounded-4 shadow-sm p-5">

            <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#fce4ec',
                    color: '#c2185b'
                }}
            >
                <i className="fa-solid fa-bag-shopping display-4"></i>
            </div>

            <h3 className="fw-bold mb-2">
                Your Cart is Empty
            </h3>

            <p
                className="text-secondary mb-4 mx-auto"
                style={{ maxWidth: '400px' }}
            >
                Looks like you haven't added any products to your beauty bag yet.
                Discover our latest collection today!
            </p>

            <Link
                to="/products"
                className="btn text-white rounded-pill px-5 py-3 fw-semibold shadow-sm"
                style={{ backgroundColor: '#c2185b' }}
            >
                <i className="fa-solid fa-arrow-left me-2"></i>
                Explore Collection
            </Link>

        </div>
    )
}