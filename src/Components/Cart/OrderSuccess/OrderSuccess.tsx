import React from 'react'
import { Link } from 'react-router-dom'

export default function OrderSuccess({ onClose }: { onClose: () => void }) {
    return (
        <div className="alert alert-success rounded-4 p-4 text-center mb-5 shadow-sm border-0">

            <div className="mb-2">
                <i className="fa-solid fa-circle-check fs-1 text-success"></i>
            </div>

            <h4 className="fw-bold mb-2">
                Thank you for your order!
            </h4>

            <p className="text-secondary mb-3">
                Your beauty products are being prepared with love and care.
            </p>

            <Link
                to="/products"
                onClick={onClose}
                className="btn text-white rounded-pill px-4 py-2"
                style={{ backgroundColor: '#c2185b' }}
            >
                Continue Shopping
            </Link>

        </div>
    )
}