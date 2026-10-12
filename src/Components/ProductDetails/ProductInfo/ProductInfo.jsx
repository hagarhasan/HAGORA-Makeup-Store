import React from 'react'

export default function ProductInfo({ product, productPrice, isPriceAvailable }) {

    return (
        <div className="col-md-6">

            <p
                className="fw-semibold text-uppercase mb-2"
                style={{
                    color: '#c2185b',
                    letterSpacing: '2px'
                }}
            >
                {product.brand || 'HAGORA'}
            </p>

            <h1 className="fw-bold mb-3">
                {product.name}
            </h1>

            <h3
                className="fw-bold mb-4"
                style={{
                    color: isPriceAvailable
                        ? '#c2185b'
                        : '#999'
                }}
            >
                {isPriceAvailable
                    ? `$${productPrice.toFixed(2)}`
                    : 'Price unavailable'
                }
            </h3>

            <p className="text-secondary lh-lg mb-4">
                {product.description ||
                    'Discover this beautiful makeup product from HAGORA.'
                }
            </p>

            <div className="mb-4">

                <p className="mb-2">
                    <strong>Category:</strong>{' '}
                    {product.category || 'Beauty'}
                </p>

                <p className="mb-2">
                    <strong>Product Type:</strong>{' '}
                    {product.product_type || 'Makeup'}
                </p>

            </div>

        </div>
    )
}