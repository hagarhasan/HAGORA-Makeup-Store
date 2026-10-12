import React, { useState } from 'react'

export default function Newsletter() {

    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    function handleSubscribe(event) {
        event.preventDefault()

        if (email) {
            setSubscribed(true)
        }
    }

    return (
        <section className="py-5">

            <div
                className="card border-0 rounded-4 text-center p-4 p-md-5 text-white"
                style={{
                    background: 'linear-gradient(135deg, #c2185b 0%, #880e4f 100%)',
                    boxShadow: '0 20px 40px rgba(194, 24, 91, 0.25)'
                }}
            >

                <div
                    className="mx-auto"
                    style={{ maxWidth: '600px' }}
                >

                    <i className="fa-regular fa-envelope-open display-4 mb-3"></i>

                    <h2 className="fw-bold mb-3">
                        Join The HAGORA Beauty Club
                    </h2>

                    <p className="mb-4 opacity-75">
                        Subscribe to receive beauty updates,
                        new products and special offers.
                    </p>

                    {subscribed ? (

                        <div className="alert alert-light rounded-pill py-2 px-4 d-inline-flex align-items-center gap-2 text-success fw-bold">

                            <i className="fa-solid fa-circle-check"></i>

                            <span>
                                Welcome to the club!
                            </span>

                        </div>

                    ) : (

                        <form
                            onSubmit={handleSubscribe}
                            className="d-flex flex-column flex-sm-row gap-2 justify-content-center"
                        >

                            <input
                                type="email"
                                className="form-control rounded-pill px-4 py-2 border-0"
                                placeholder="Enter your email address..."
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                                style={{ maxWidth: '380px' }}
                            />

                            <button
                                type="submit"
                                className="btn btn-light rounded-pill px-4 py-2 fw-bold"
                                style={{ color: '#c2185b' }}
                            >
                                Subscribe Now
                            </button>

                        </form>

                    )}

                </div>

            </div>

        </section>
    )
}