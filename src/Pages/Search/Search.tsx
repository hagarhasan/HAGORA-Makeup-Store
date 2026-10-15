import React, { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../../Components/Header/Header'
import SearchBox from '../../Components/Search/SearchBox/SearchBox'
import SearchResults from '../../Components/Search/SearchResults/SearchResults'
import type { Product as ProductType } from '../../types/product'
import type { ChangeEvent, FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'

export default function Search({ products, loading }: { products: ProductType[]; loading: boolean }) {

    const [searchParams, setSearchParams] = useSearchParams()

    const query = searchParams.get('q') || ''

    const [searchValue, setSearchValue] = useState(query)
    const [currentPage, setCurrentPage] = useState(1)
    const [prevQuery, setPrevQuery] = useState(query)

    const productsPerPage = 12

    if (query !== prevQuery) {
        setPrevQuery(query)
        setSearchValue(query)
        setCurrentPage(1)
    }

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

    function handleSearchChange(e: ChangeEvent<HTMLInputElement>) {
        setSearchValue(e.target.value)
    }

    function handleSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const value = searchValue.trim()

        if (!value) {
            setSearchParams({})
        } else {
            setSearchParams({ q: value })
        }

        setCurrentPage(1)
    }

    function handleClear() {
        setSearchValue('')
        setSearchParams({})
        setCurrentPage(1)
    }

    function handlePageChange(page: number) {

        setCurrentPage(page)

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    return (
        <div className="my-5">
            <Helmet>
                <title>HAGORA - Search</title>
                <meta name="description" content="Search for your favorite beauty products" />
                <meta name="keywords" content="Search, HAGORA" />
                <meta name="author" content="HAGORA" />
            </Helmet>
            <Header
                title="Search"
                description="Find your favorite beauty products"
            />

            <SearchBox
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                onSearch={handleSearch}
                onClear={handleClear}
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
                    totalResults={searchResults.length}
                    currentPage={currentPage}
                    numberOfPages={numberOfPages}
                    onPageChange={handlePageChange}
                />

            )}

        </div>
    )
}