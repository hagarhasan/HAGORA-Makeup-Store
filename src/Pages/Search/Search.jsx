import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../../Components/Header/Header'
import SearchBox from '../../Components/Search/SearchBox/SearchBox'
import SearchResults from '../../Components/Search/SearchResults/SearchResults'

export default function Search({ products, loading }) {

    const [searchParams] = useSearchParams()

    const query = searchParams.get('q') || ''

    const [searchValue, setSearchValue] = useState(query)
    const [currentPage, setCurrentPage] = useState(1)

    const productsPerPage = 12

    const searchResults = useMemo(() => {

        if (!query.trim()) {
            return []
        }

        const searchText = query.toLowerCase().trim()

        const result = products.filter(product => {

            const name =
                product.name?.toLowerCase() || ''

            const brand =
                product.brand?.toLowerCase() || ''

            const category =
                product.category?.toLowerCase() || ''

            const type =
                product.product_type?.toLowerCase() || ''

            return (
                name.includes(searchText) ||
                brand.includes(searchText) ||
                category.includes(searchText) ||
                type.includes(searchText)
            )
        })

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

        return result

    }, [products, query])

    const numberOfPages = Math.ceil(
        searchResults.length / productsPerPage
    )

    const firstIndex =
        (currentPage - 1) * productsPerPage

    const currentProducts =
        searchResults.slice(
            firstIndex,
            firstIndex + productsPerPage
        )

    function handleSearchChange(e) {
        setSearchValue(e.target.value)
        setCurrentPage(1)
    }

    function handleSearch(e) {
        e.preventDefault()

        const value = searchValue.trim()

        if (!value) {

            window.history.pushState(
                {},
                '',
                '/search'
            )

            window.location.reload()

            return
        }

        window.history.pushState(
            {},
            '',
            `/search?q=${encodeURIComponent(value)}`
        )

        window.location.reload()
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
                title="Search"
                description="Find your favorite beauty products"
            />

            <SearchBox
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                onSearch={handleSearch}
            />

            {loading ? (

                <div className="text-center py-5">

                    <div
                        className="spinner-border"
                        style={{ color: '#c2185b' }}
                    ></div>

                    <p className="text-secondary mt-3">
                        Searching products...
                    </p>

                </div>

            ) : (

                <SearchResults
                    query={query}
                    products={currentProducts}
                    currentPage={currentPage}
                    numberOfPages={numberOfPages}
                    onPageChange={handlePageChange}
                />

            )}

        </div>
    )
}