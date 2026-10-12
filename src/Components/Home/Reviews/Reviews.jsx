import React from 'react'

export default function Reviews() {

    const reviews = [
        {
            name: 'Sarah',
            rating: 5,
            comment: 'I found so many beautiful products on HAGORA. The collection is amazing!',
            role: 'Verified Customer'
        },
        {
            name: 'Mariam',
            rating: 5,
            comment: 'The products are easy to find and the website is so simple to use.',
            role: 'Verified Customer'
        },
        {
            name: 'Nour',
            rating: 5,
            comment: 'HAGORA has become one of my favorite places to discover makeup products.',
            role: 'Verified Customer'
        }
    ]

    return (
        <section className="py-5">

            <div className="text-center mb-5">

                <span className="hagora-badge-pill mb-2 d-inline-block">
                    COMMUNITY LOVE
                </span>

                <h2 className="fw-bold">
                    Loved by Beauty Lovers
                </h2>

                <p className="text-secondary">
                    See what our customers say about HAGORA.
                </p>

            </div>

            <div className="row g-4">

                {reviews.map((review, index) => (

                    <div
                        className="col-md-4"
                        key={index}
                    >

                        <div
                            className="card h-100 border-0 shadow-sm p-4 rounded-4"
                            style={{ backgroundColor: '#fff8fa' }}
                        >

                            <div className="text-warning mb-3">

                                {[...Array(review.rating)].map((_, index) => (
                                    <i
                                        key={index}
                                        className="fa-solid fa-star me-1"
                                    ></i>
                                ))}

                            </div>

                            <p
                                className="text-dark fst-italic mb-4"
                                style={{ lineHeight: '1.6' }}
                            >
                                "{review.comment}"
                            </p>

                            <div className="mt-auto d-flex align-items-center gap-3">

                                <div
                                    className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        backgroundColor: '#c2185b'
                                    }}
                                >
                                    {review.name.charAt(0)}
                                </div>

                                <div>

                                    <h6 className="fw-bold mb-0">
                                        {review.name}
                                    </h6>

                                    <small className="text-muted">
                                        <i className="fa-solid fa-circle-check text-success me-1"></i>
                                        {review.role}
                                    </small>

                                </div>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </section>
    )
}