import React from 'react'
import placeholderImg from '../../../assets/placeholder.svg'

export default function ProductImage({ product }) {

    const imageSource =
        product.image_link ||
        product.api_featured_image ||
        placeholderImg

    return (
        <div className="col-md-6">

            <div
                className="rounded-4 d-flex align-items-center justify-content-center p-4"
                style={{
                    height: '500px',
                    backgroundColor: '#fce4ec'
                }}
            >

                <img
                    src={imageSource}
                    onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = placeholderImg
                    }}
                    alt={product.name}
                    className="img-fluid"
                    style={{
                        maxHeight: '450px',
                        objectFit: 'contain'
                    }}
                />

            </div>

        </div>
    )
}