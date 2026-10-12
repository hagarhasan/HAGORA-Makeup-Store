import React, { useMemo, useState } from 'react'
import Header from '../../Components/Header/Header'
import ProductFilters from '../../Components/Products/ProductFilters/ProductFilters'
import ProductGrid from '../../Components/Products/ProductGrid/ProductGrid'
import ProductPagination from '../../Components/Products/ProductPagination/ProductPagination'

export default function Products({ products, loading }) {

    const [currentPage, setCurrentPage] = useState(1)
    const [priceFilter, setPriceFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')

    const productsPerPage = 12

    const categories = [
        ...new Set(
            products
                .map(product => product.category)
                .filter(Boolean)
        )
    ]

    const filteredProducts = useMemo(() => {

        let result = [...products]

        result.sort((a, b) => {

            const priceA = Number(a.price)
            const priceB = Number(b.price)

            const unavailableA =
                isNaN(priceA) || priceA <= 0

            const unavailableB =
                isNaN(priceB) || priceB <= 0

            if (unavailableA && !unavailableB) {
                return 1
            }

            if (!unavailableA && unavailableB) {
                return -1
            }

            return 0
        })

        if (categoryFilter !== 'all') {
            result = result.filter(
                product =>
                    product.category === categoryFilter
            )
        }

        if (priceFilter === 'under25') {
            result = result.filter(
                product =>
                    Number(product.price) > 0 &&
                    Number(product.price) < 25
            )
        }

        if (priceFilter === '25to50') {
            result = result.filter(
                product =>
                    Number(product.price) >= 25 &&
                    Number(product.price) <= 50
            )
        }

        if (priceFilter === 'over50') {
            result = result.filter(
                product =>
                    Number(product.price) > 50
            )
        }

        return result

    }, [products, categoryFilter, priceFilter])

    const numberOfPages =
        Math.ceil(
            filteredProducts.length / productsPerPage
        )

    const firstIndex =
        (currentPage - 1) * productsPerPage

    const currentProducts =
        filteredProducts.slice(
            firstIndex,
            firstIndex + productsPerPage
        )

    function handleCategoryChange(e) {
        setCategoryFilter(e.target.value)
        setCurrentPage(1)
    }

    function handlePriceChange(e) {
        setPriceFilter(e.target.value)
        setCurrentPage(1)
    }

    function handleReset() {
        setCategoryFilter('all')
        setPriceFilter('all')
        setCurrentPage(1)
    }

    function handlePageChange(page) {
        setCurrentPage(page)

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <div className="my-5">

            <Header
                title="Our Collection"
                description="Discover our latest makeup collection"
            />

            {loading ? (

                <div className="text-center my-5 py-5">

                    <div
                        className="spinner-border"
                        role="status"
                        style={{
                            color: '#c2185b',
                            width: '3rem',
                            height: '3rem'
                        }}
                    >
                        <span className="visually-hidden">
                            Loading...
                        </span>
                    </div>

                    <p className="mt-3 text-secondary fw-semibold">
                        Loading makeup collection...
                    </p>

                </div>

            ) : (

                <>

                    <ProductFilters
                        categories={categories}
                        categoryFilter={categoryFilter}
                        priceFilter={priceFilter}
                        onCategoryChange={handleCategoryChange}
                        onPriceChange={handlePriceChange}
                        onReset={handleReset}
                        productsCount={filteredProducts.length}
                    />

                    <ProductGrid
                        products={currentProducts}
                    />

                    <ProductPagination
                        currentPage={currentPage}
                        numberOfPages={numberOfPages}
                        onPageChange={handlePageChange}
                    />

                </>

            )}

        </div>
    )
}