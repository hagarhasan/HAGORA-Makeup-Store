import { useState } from 'react'
import type { FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function Newsletter() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<Status>('idle')

    async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const value = email.trim()
        if (!value || status === 'submitting') return

        setStatus('submitting')

        try {
            // TODO: replace with your real subscribe request, e.g.
            // await subscribeToNewsletter({ email: value })
            await new Promise((resolve) => setTimeout(resolve, 600))
            setStatus('success')
        } catch {
            setStatus('error')
        }
    }

    return (
        <section className="py-5" aria-labelledby="newsletter-title">
            <div
                className="card border-0 rounded-4 text-center p-4 p-md-5 text-white"
                style={{
                    background: 'linear-gradient(135deg, #c2185b 0%, #880e4f 100%)',
                    boxShadow: '0 20px 40px rgba(194, 24, 91, 0.25)',
                }}
            >
                <div className="mx-auto w-100" style={{ maxWidth: '600px' }}>
                    <i className="fa-regular fa-envelope-open display-4 mb-3" aria-hidden="true" />

                    <h2 id="newsletter-title" className="fw-bold mb-3">
                        Join The HAGORA Beauty Club
                    </h2>

                    <p className="mb-4" style={{ opacity: 0.85 }}>
                        Get new arrivals and special offers straight to your inbox.
                    </p>

                    {status === 'success' ? (
                        <div
                            className="alert alert-light rounded-pill py-2 px-4 d-inline-flex align-items-center gap-2 text-success fw-bold mb-0"
                            role="status"
                        >
                            <i className="fa-solid fa-circle-check" aria-hidden="true" />
                            <span>You're in! Check your inbox soon.</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} noValidate>
                            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                                <label htmlFor="newsletter-email" className="visually-hidden">
                                    Email address
                                </label>
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    className="form-control rounded-pill px-4 py-2 border-0"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value)
                                        if (status === 'error') setStatus('idle')
                                    }}
                                    autoComplete="email"
                                    required
                                    style={{ maxWidth: '380px' }}
                                />

                                <button
                                    type="submit"
                                    className="btn btn-light rounded-pill px-4 py-2 fw-bold"
                                    style={{ color: '#c2185b' }}
                                    disabled={status === 'submitting'}
                                >
                                    {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
                                </button>
                            </div>

                            {status === 'error' && (
                                <p className="mt-3 mb-0 small" role="alert">
                                    Something went wrong. Please try again.
                                </p>
                            )}

                            <p className="mt-3 mb-0 small" style={{ opacity: 0.7 }}>
                                No spam. Unsubscribe anytime.
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}