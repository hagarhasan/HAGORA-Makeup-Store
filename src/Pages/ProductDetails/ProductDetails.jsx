import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../../Context/CartContext'
import ProductImage from '../../Components/ProductDetails/ProductImage/ProductImage'
import ProductInfo from '../../Components/ProductDetails/ProductInfo/ProductInfo'
import ProductActions from '../../Components/ProductDetails/ProductActions/ProductActions'

export default function ProductDetails({ products, loading }) {

    const { id } = useParams()
    const {
        addToCart,
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart
    } = useCart()
    const [added, setAdded] = useState(false)

    if (loading) {
        return (
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
                    Loading product details...
                </p>

            </div>
        )
    }

    const product = products?.find(
        p => Number(p.id) === Number(id)
    )

    if (!product) {
        return (
            <div className="text-center my-5 py-5">

                <h3 className="text-danger">
                    Product not found
                </h3>

                <p className="text-secondary">
                    Please try searching again
                </p>

                <Link
                    to="/products"
                    className="btn text-white rounded-pill px-4 py-2 mt-3"
                    style={{ backgroundColor: '#c2185b' }}
                >
                    Back to Collection
                </Link>

            </div>
        )
    }

    const productPrice = Number(product.price)

    const isPriceAvailable =
        !isNaN(productPrice) && productPrice > 0

    const isInCart = cartItems.some(
        item => item.id === product.id
    )

    const cartProduct = cartItems.find(
        item => item.id === product.id
    )

    const quantity = cartProduct?.quantity || 0

    return (
        <div className="py-5">

            <div className="row align-items-center g-5">

                <ProductImage
                    product={product}
                />

                <div className="col-md-6">

                    <ProductInfo
                        product={product}
                        productPrice={productPrice}
                        isPriceAvailable={isPriceAvailable}
                    />

                    <ProductActions
                        addToCart={addToCart}
                        product={product}
                        isPriceAvailable={isPriceAvailable}
                        isInCart={isInCart}
                        quantity={quantity}
                        increaseQuantity={increaseQuantity}
                        decreaseQuantity={decreaseQuantity}
                        removeFromCart={removeFromCart}
                        added={added}
                        setAdded={setAdded}
                    />

                </div>

            </div>

        </div>
    )
}