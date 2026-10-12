import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function DiscountBanner() {

    const [copiedCode, setCopiedCode] = useState(false)

    function handleCopyCode() {
        navigator.clipboard.writeText('HAGORA20')

        setCopiedCode(true)

        setTimeout(() => {
            setCopiedCode(false)
        }, 2000)
    }

    return (
        <section className="my-5">

            <div className="hagora-banner-box">

                <div className="row align-items-center g-4">

                    <div className="col-lg-8">

                        <span className="hagora-badge-pill mb-2 d-inline-block">
                            SPECIAL OFFER
                        </span>

                        <h2 className="display-6 fw-bold mb-2">
                            Get 20% Off Your First Glam Order
                        </h2>

                        <p
                            className="text-secondary mb-3 fs-6"
                            style={{ maxWidth: '620px' }}
                        >
                            Unlock your glow with code
                            <strong className="text-dark ms-1">
                                HAGORA20
                            </strong>
                            {' '}at checkout.
                            Valid on selected makeup and beauty products.
                        </p>

                        <div className="d-flex align-items-center gap-3 flex-wrap">

                            <button
                                onClick={handleCopyCode}
                                className="btn btn-outline-dark rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                            >
                                <i
                                    className={
                                        copiedCode
                                            ? 'fa-solid fa-check text-success'
                                            : 'fa-regular fa-copy'
                                    }
                                ></i>

                                <span>
                                    {copiedCode
                                        ? 'Copied to Clipboard!'
                                        : 'Copy Code: HAGORA20'}
                                </span>
                            </button>

                            <Link
                                to="/products"
                                className="btn-hagora-primary"
                            >
                                <span>Shop Now</span>
                                <i className="fa-solid fa-arrow-right"></i>
                            </Link>

                        </div>

                    </div>

                    <div className="col-lg-4 text-center text-lg-end">

                        <i
                            className="fa-solid fa-gift display-1"
                            style={{
                                color: '#c2185b',
                                opacity: 0.85
                            }}
                        ></i>

                    </div>

                </div>

            </div>

        </section>
    )
}