import React from 'react'

export default function SearchBox({
    searchValue,
    onSearchChange,
    onSearch
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