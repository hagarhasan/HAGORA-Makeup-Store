import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const PROMO_CODE = 'HAGORA20'

type CopyStatus = 'idle' | 'copied' | 'error'

export default function DiscountBanner() {
    const [status, setStatus] = useState<CopyStatus>('idle')
    const timeoutRef = useRef<number | undefined>(undefined)

    useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

    async function handleCopyCode() {
        try {
            await navigator.clipboard.writeText(PROMO_CODE)
            setStatus('copied')
        } catch {
            setStatus('error')
        }

        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = window.setTimeout(() => setStatus('idle'), 2500)
    }

    return (
        <section className="my-5" aria-labelledby="discount-title">
            <div className="hagora-banner-box">
                <div className="row align-items-center g-4">
                    <div className="col-lg-8">
                        <span className="hagora-badge-pill mb-2 d-inline-block">
                            SPECIAL OFFER
                        </span>

                        <h2 id="discount-title" className="display-6 fw-bold mb-2">
                            Get 20% Off Your First Glam Order
                        </h2>

                        <p className="text-secondary mb-3 fs-6" style={{ maxWidth: '620px' }}>
                            Unlock your glow with code{' '}
                            <strong className="text-dark ms-1">{PROMO_CODE}</strong> at
                            checkout. Valid on selected makeup and beauty products.
                        </p>

                        <div className="d-flex align-items-center gap-3 flex-wrap">
                            <button
                                type="button"
                                onClick={handleCopyCode}
                                className="btn btn-outline-dark rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                            >
                                <i
                                    className={
                                        status === 'copied'
                                            ? 'fa-solid fa-check text-success'
                                            : 'fa-regular fa-copy'
                                    }
                                    aria-hidden="true"
                                />
                                <span>
                                    {status === 'copied'
                                        ? 'Copied to Clipboard!'
                                        : status === 'error'
                                            ? `Copy failed. Code: ${PROMO_CODE}`
                                            : `Copy Code: ${PROMO_CODE}`}
                                </span>
                            </button>

                            <Link to="/products" className="btn-hagora-primary">
                                <span>Shop Now</span>
                                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                            </Link>
                        </div>

                        {/* Announces the result to screen readers */}
                        <span className="visually-hidden" role="status" aria-live="polite">
                            {status === 'copied' ? 'Promo code copied to clipboard' : ''}
                        </span>
                    </div>

                    <div className="col-lg-4 text-center text-lg-end" aria-hidden="true">
                        <i
                            className="fa-solid fa-gift display-1"
                            style={{ color: '#c2185b', opacity: 0.85 }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}