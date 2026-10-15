import React from 'react'
import type { FormEvent, ChangeEvent } from 'react'

export default function SearchBox({
    searchValue,
    onSearchChange,
    onSearch,
    onClear
}: {
    searchValue: string
    onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void
    onSearch: (event: FormEvent<HTMLFormElement>) => void
    onClear?: () => void
}) {

    return (
        <div className="search-box mb-5">

            <form
                onSubmit={onSearch}
                className="d-flex gap-2"
            >

                <div className="position-relative flex-grow-1">

                    <i className="fa-solid fa-magnifying-glass search-icon"></i>

                    <input
                        type="text"
                        className="form-control search-input"
                        placeholder="Search for lipstick, foundation, blush..."
                        value={searchValue}
                        onChange={onSearchChange}
                    />

                    {searchValue && onClear && (
                        <button
                            type="button"
                            onClick={onClear}
                            aria-label="Clear search"
                            style={{
                                position: 'absolute',
                                right: '50px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                border: 'none',
                                color: '#999',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                fontSize: '14px',
                            }}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}

                </div>

                <button
                    type="submit"
                    className="search-btn"
                >
                    Search
                </button>

            </form>

        </div>
    )
}