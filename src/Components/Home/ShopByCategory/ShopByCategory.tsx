import { Link } from 'react-router-dom'
import type { Product } from '../../../types/product'

const CATEGORIES = [
    { type: 'lipstick', label: 'Lipstick' },
    { type: 'foundation', label: 'Foundation' },
    { type: 'blush', label: 'Blush' },
    { type: 'eyeshadow', label: 'Eyeshadow' },
]

export default function ShopByCategory({ products }: { products: Product[] }) {
    // Keep only categories that actually have a product to show.
    const categories = CATEGORIES.flatMap((category) => {
        const product = products.find(
            (item) => item.product_type?.toLowerCase() === category.type,
        )
        return product ? [{ ...category, product }] : []
    })

    if (categories.length === 0) return null

    return (
        <section className="py-5" aria-labelledby="shop-by-category-title">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <p
                        className="fw-semibold text-uppercase small mb-1"
                        style={{ color: '#c2185b', letterSpacing: '2px' }}
                    >
                        Explore Our Collection
                    </p>
                    <h2 id="shop-by-category-title" className="fw-bold mb-0">
                        Shop By Category
                    </h2>
                </div>

                {/* Visible on mobile too */}
                <Link
                    to="/products"
                    className="text-decoration-none fw-semibold d-inline-flex align-items-center gap-1"
                    style={{ color: '#c2185b' }}
                >
                    <span>View All</span>
                    <i className="fa-solid fa-angle-right" aria-hidden="true" />
                </Link>
            </div>

            <div className="row g-3 g-md-4">
                {categories.map(({ type, label, product }) => (
                    <div className="col-6 col-md-3" key={type}>
                        {/* Needs the Products page to read ?type=... (see notes) */}
                        <Link
                            to={`/products?type=${type}`}
                            className="text-decoration-none text-dark d-block h-100"
                            aria-label={`Shop ${label}`}
                        >
                            <div className="hagora-category-card p-3 text-center h-100">
                                <div className="hagora-category-img-box mb-3">
                                    {product.image_link ? (
                                        <img
                                            src={product.image_link}
                                            alt=""
                                            className="hagora-category-img"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    ) : (
                                        <i
                                            className="fa-solid fa-wand-magic-sparkles fs-1"
                                            style={{ color: '#f3b7cc' }}
                                            aria-hidden="true"
                                        />
                                    )}
                                </div>

                                <h3 className="h6 fw-bold mb-1">{label}</h3>

                                <p
                                    className="small fw-semibold mb-0 d-inline-flex align-items-center gap-1"
                                    style={{ color: '#c2185b' }}
                                >
                                    Shop now
                                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}