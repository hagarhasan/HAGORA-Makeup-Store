import React from 'react'
import { useCart } from '../../../Context/useCart'
import placeholderImg from '../../../assets/placeholder.svg'
import { Link } from 'react-router-dom'
import type { CartItem as CartItemType } from '../../../types/product'

export default function CartItem({ item }: { item: CartItemType }) {

    const {
        removeFromCart,
        increaseQuantity,
        decreaseQuantity
    } = useCart()

    const itemPrice =
        isNaN(Number(item.price)) || Number(item.price) <= 0
            ? 15
            : Number(item.price)

    const itemSubtotal = (itemPrice * item.quantity).toFixed(2)

    const imageSource =
        item.image_link ||
        item.api_featured_image ||
        placeholderImg

    return (
        <div className="card border-0 shadow-sm rounded-4 p-3 mb-3">

            <div className="row align-items-center g-3">

                <div className="col-4 col-sm-3 col-md-2">
                    <div
                        className="rounded-3 d-flex align-items-center justify-content-center p-2"
                        style={{
                            height: '90px',
                            backgroundColor: '#fce4ec'
                        }}
                    >
                        <img
                            src={imageSource}
                            alt={item.name}
                            className="img-fluid"
                            style={{
                                maxHeight: '75px',
                                objectFit: 'contain'
                            }}
                            onError={(e) => {
                                e.currentTarget.onerror = null
                                e.currentTarget.src = placeholderImg
                            }}
                        />
                    </div>
                </div>

                <div className="col-8 col-sm-4 col-md-4">

                    <small
                        className="fw-semibold text-uppercase d-block"
                        style={{
                            color: '#c2185b',
                            fontSize: '0.75rem'
                        }}
                    >
                        {item.brand || 'Beauty'}
                    </small>

                    <h6
                        className="fw-bold mb-1 text-truncate"
                        title={item.name}
                    >
                        <Link
                            to={`/products/${item.id}`}
                            className="text-decoration-none"
                            style={{ color: '#222' }}
                        >
                            {item.name}
                        </Link>
                    </h6>

                    <span className="fw-semibold text-secondary small">
                        ${itemPrice.toFixed(2)} each
                    </span>

                </div>

                <div className="col-6 col-sm-3 col-md-3">

                    <div
                        className="d-inline-flex align-items-center rounded-pill border p-1"
                        style={{ backgroundColor: '#fff' }}
                    >

                        <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width: '28px',
                                height: '28px',
                                backgroundColor: '#fce4ec',
                                color: '#c2185b',
                                border: 'none'
                            }}
                        >
                            <i
                                className="fa-solid fa-minus"
                                style={{ fontSize: '0.7rem' }}
                            ></i>
                        </button>

                        <span className="px-3 fw-bold small">
                            {item.quantity}
                        </span>

                        <button
                            onClick={() => increaseQuantity(item.id)}
                            className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                                width: '28px',
                                height: '28px',
                                backgroundColor: '#c2185b',
                                color: '#fff',
                                border: 'none'
                            }}
                        >
                            <i
                                className="fa-solid fa-plus"
                                style={{ fontSize: '0.7rem' }}
                            ></i>
                        </button>

                    </div>

                </div>

                <div className="col-6 col-sm-2 col-md-3 text-end d-flex align-items-center justify-content-end gap-3">

                    <span
                        className="fw-bold fs-6"
                        style={{ color: '#c2185b' }}
                    >
                        ${itemSubtotal}
                    </span>

                    <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn btn-outline-danger btn-sm rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: '32px',
                            height: '32px'
                        }}
                    >
                        <i
                            className="fa-solid fa-trash-can"
                            style={{ fontSize: '0.8rem' }}
                        ></i>
                    </button>

                </div>

            </div>

        </div>
    )
}