import { Helmet } from 'react-helmet-async'
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <Helmet>
                    <title>HAGORA - 404 Not Found</title>
                    <meta name="description" content="Page not found" />
                    <meta name="keywords" content="404, Not Found, HAGORA" />
                    <meta name="author" content="HAGORA" />
                </Helmet>

                <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                    style={{
                        width: '100px',
                        height: '100px',
                        backgroundColor: '#fce4ec'
                    }}
                >
                    <i
                        className="fa-solid fa-face-sad-tear fs-1"
                        style={{ color: '#d63384' }}
                    ></i>
                </div>

                <p
                    className="fw-semibold text-uppercase mb-2"
                    style={{ color: '#d63384', letterSpacing: '3px' }}
                >
                    HAGORA
                </p>

                <h1
                    className="display-1 fw-bold mb-0"
                    style={{ color: '#d63384' }}
                >
                    404
                </h1>

                <h2 className="fw-bold text-dark mb-3">
                    Page Not Found
                </h2>

                <p className="text-secondary mb-4">
                    Sorry, the page you're looking for doesn't exist.
                    <br />
                    Let's get you back to HAGORA.
                </p>

                <Link
                    to="/"
                    className="btn rounded-pill px-4 py-2 text-white"
                    style={{ backgroundColor: '#d63384' }}
                >
                    <i className="fa-solid fa-house me-2"></i>
                    Back to Home
                </Link>

            </div>
        </div>
    )
}
