import React from 'react'
import Card from '../../Card/Card'

export default function ProductGrid({ products }) {

    if (!products.length) {
        return (
            <div className="text-center my-5 py-5">
                <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#fce4ec',
                        color: '#c2185b'
                    }}
                >
                    <i className="fa-solid fa-box-open fs-2"></i>
                </div>

                <h4 className="fw-bold">
                    No Products Found
                </h4>

                <p className="text-secondary">
                    Try changing your filters to find more products.
                </p>
            </div>
        )
    }

    return (
        <div className="row g-4">

            {products.map(product => {

                const price = Number(product.price)

                const isPriceAvailable =
                    !isNaN(price) && price > 0

                return (
                    <div
                        key={product.id}
                        className="col-lg-3 col-md-4 col-sm-6 col-12"
                    >
                        <Card
                            product={product}
                            badge={
                                isPriceAvailable
                                    ? null
                                    : 'Unavailable'
                            }
                        />
                    </div>
                )
            })}

        </div>
    )
}