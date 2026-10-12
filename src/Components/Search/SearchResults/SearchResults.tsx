import React from 'react'
import ProductGrid from '../../Products/ProductGrid/ProductGrid'
import ProductPagination from '../../Products/ProductPagination/ProductPagination'
import type { Product } from '../../../types/product'

export default function SearchResults({
    query,
    products,
    currentPage,
    numberOfPages,
    onPageChange
}: {
    query: string
    products: Product[]
    currentPage: number
    numberOfPages: number
    onPageChange: (page: number) => void
}) {

    if (!query) {
        return (
            <div className="text-center py-5">

                <i
                    className="fa-solid fa-magnifying-glass display-4 mb-3"
                    style={{ color: '#c2185b' }}
                ></i>

                <h4 className="fw-bold">
                    What are you looking for?
                </h4>

                <p className="text-secondary">
                    Search for your favorite makeup products.
                </p>

            </div>
        )
    }

    return (
        <>
            <div className="mb-4">

                <h5 className="fw-bold">
                    Search results for:

                    <span
                        className="ms-2"
                        style={{ color: '#c2185b' }}
                    >
                        "{query}"
                    </span>
                </h5>

                <p className="text-secondary">
                    {products.length} products found
                </p>

            </div>

            <ProductGrid
                products={products}
            />

            <ProductPagination
                currentPage={currentPage}
                numberOfPages={numberOfPages}
                onPageChange={onPageChange}
            />
        </>
    )
}