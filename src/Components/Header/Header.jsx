import React from 'react'

export default function Header({ title, description }) {
    return (
        <section
            className="py-5 text-center rounded-4 mb-5"
            style={{ backgroundColor: '#fce4ec' }}
        >
            <div className="container">

                <p
                    className="fw-semibold text-uppercase mb-2"
                    style={{
                        color: '#c2185b',
                        letterSpacing: '3px'
                    }}
                >
                    HAGORA
                </p>

                <h1
                    className="display-5 fw-bold mb-3"
                    style={{ color: '#c2185b' }}
                >
                    {title}
                </h1>

                <p className="text-secondary mb-0">
                    {description}
                </p>

            </div>
        </section>
    )
}