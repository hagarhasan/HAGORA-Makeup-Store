import React from 'react'
import styles from './ProductPagination.module.css'
export default function ProductPagination({
    currentPage,
    numberOfPages,
    onPageChange
}) {

    if (numberOfPages <= 1) {
        return null
    }

    function getPages() {

        if (numberOfPages <= 7) {
            return Array.from(
                { length: numberOfPages },
                (_, index) => index + 1
            )
        }

        if (currentPage <= 4) {
            return [
                1,
                2,
                3,
                4,
                5,
                '...',
                numberOfPages
            ]
        }

        if (currentPage >= numberOfPages - 3) {
            return [
                1,
                '...',
                numberOfPages - 4,
                numberOfPages - 3,
                numberOfPages - 2,
                numberOfPages - 1,
                numberOfPages
            ]
        }

        return [
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            numberOfPages
        ]
    }

    const pages = getPages()

    return (
        <div className="d-flex justify-content-center mt-5">

            <ul className={`pagination hagora-pagination ${styles.pagination}`}>

                <li
                    className={`page-item ${currentPage === 1
                        ? 'disabled'
                        : ''
                        }`}
                >
                    <button
                        className="page-link"
                        onClick={() =>
                            onPageChange(currentPage - 1)
                        }
                    >
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                </li>

                {pages.map((page, index) => {

                    if (page === '...') {
                        return (
                            <li
                                key={`dots-${index}`}
                                className="page-item disabled"
                            >
                                <span className="page-link">
                                    ...
                                </span>
                            </li>
                        )
                    }

                    return (
                        <li
                            key={page}
                            className={`page-item ${currentPage === page
                                ? 'active'
                                : ''
                                }`}
                        >
                            <button
                                className="page-link"
                                onClick={() =>
                                    onPageChange(page)
                                }
                            >
                                {page}
                            </button>
                        </li>
                    )
                })}

                <li
                    className={`page-item ${currentPage === numberOfPages
                        ? 'disabled'
                        : ''
                        }`}
                >
                    <button
                        className="page-link"
                        onClick={() =>
                            onPageChange(currentPage + 1)
                        }
                    >
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </li>

            </ul>

        </div>
    )
}