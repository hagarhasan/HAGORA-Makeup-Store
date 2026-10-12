import React from 'react'

export default function ProductFilters({
    categories,
    categoryFilter,
    priceFilter,
    onCategoryChange,
    onPriceChange,
    onReset,
    productsCount
}: {
    categories: string[]
    categoryFilter: string
    priceFilter: string
    onCategoryChange: (value: string) => void
    onPriceChange: (value: string) => void
    onReset: () => void
    productsCount: number
}) {

    const priceOptions = [
        {
            value: 'all',
            label: 'All'
        },
        {
            value: 'under25',
            label: 'Under $25'
        },
        {
            value: '25to50',
            label: '$25 - $50'
        },
        {
            value: 'over50',
            label: 'Over $50'
        }
    ]

    return (
        <section className="hagora-filter mb-5">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                <div>
                    <span className="hagora-filter-eyebrow">
                        Refine Your Selection
                    </span>

                    <div className="d-flex align-items-center gap-2">
                        <h5 className="fw-bold mb-0">
                            Shop By
                        </h5>

                        <span className="hagora-product-count">
                            {productsCount}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onReset}
                    className="hagora-reset"
                >
                    <i className="fa-solid fa-rotate-left me-2"></i>
                    Reset
                </button>

            </div>

            <div className="hagora-filter-divider"></div>

            <div className="row g-4">

                <div className="col-lg-7">

                    <p className="hagora-filter-title">
                        Category
                    </p>

                    <div className="d-flex flex-wrap gap-2">

                        <button
                            onClick={() =>
                                onCategoryChange('all')
                            }
                            className={`hagora-filter-pill ${categoryFilter === 'all'
                                ? 'active'
                                : ''
                                }`}
                        >
                            All Products
                        </button>

                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() =>
                                    onCategoryChange(category)
                                }
                                className={`hagora-filter-pill ${categoryFilter === category
                                    ? 'active'
                                    : ''
                                    }`}
                            >
                                {category}
                            </button>
                        ))}

                    </div>

                </div>

                <div className="col-lg-5">

                    <p className="hagora-filter-title">
                        Price Range
                    </p>

                    <div className="d-flex flex-wrap gap-2">

                        {priceOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() =>
                                    onPriceChange(option.value)
                                }
                                className={`hagora-price-pill ${priceFilter === option.value
                                    ? 'active'
                                    : ''
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}

                    </div>

                </div>

            </div>

        </section>
    )
}

