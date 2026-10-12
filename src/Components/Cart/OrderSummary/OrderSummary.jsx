import React, { useState, useEffect } from 'react'
import { useCart } from '../../../Context/CartContext'

export default function OrderSummary({ onCheckout }) {

    const {
        totalPrice
    } = useCart()

    const [discountCode, setDiscountCode] = useState('')

    const [appliedDiscounts, setAppliedDiscounts] = useState(() => {
        const savedDiscounts = localStorage.getItem('hagoraDiscounts')

        return savedDiscounts
            ? JSON.parse(savedDiscounts)
            : []
    })

    useEffect(() => {
        localStorage.setItem(
            'hagoraDiscounts',
            JSON.stringify(appliedDiscounts)
        )
    }, [appliedDiscounts])

    const [discountMessage, setDiscountMessage] = useState('')

    const discountCodes = {
        HAGORA20: 20
    }

    function handleApplyDiscount() {

        const code = discountCode.trim().toUpperCase()

        if (!discountCodes[code]) {
            setDiscountMessage('Invalid discount code')
            return
        }

        const alreadyApplied = appliedDiscounts.some(
            discount => discount.code === code
        )

        if (alreadyApplied) {
            setDiscountMessage('This discount code is already applied')
            return
        }

        setAppliedDiscounts(prev => [
            ...prev,
            {
                code,
                percentage: discountCodes[code]
            }
        ])

        setDiscountCode('')
        setDiscountMessage('Discount applied successfully!')
    }

    const totalDiscount = appliedDiscounts.reduce(
        (total, discount) => {
            return total + (totalPrice * discount.percentage / 100)
        },
        0
    )

    const finalTotal = totalPrice - totalDiscount

    return (
        <div className="col-lg-4">

            <div
                className="card border-0 shadow-sm rounded-4 p-4 sticky-top"
                style={{ top: '90px' }}
            >

                <h5 className="fw-bold mb-4">
                    Order Summary
                </h5>

                <div className="mb-4">

                    <label className="form-label fw-semibold">
                        Discount Code
                    </label>

                    <div className="input-group">

                        <input
                            type="text"
                            className="form-control rounded-start-pill"
                            placeholder="Enter code"
                            value={discountCode}
                            onChange={(e) => {
                                setDiscountCode(e.target.value)
                                setDiscountMessage('')
                            }}
                        />

                        <button
                            onClick={handleApplyDiscount}
                            className="btn text-white rounded-end-pill px-3"
                            style={{ backgroundColor: '#c2185b' }}
                        >
                            Apply
                        </button>

                    </div>

                    {discountMessage && (
                        <small
                            className={
                                discountMessage === 'Discount applied successfully!'
                                    ? 'text-success'
                                    : 'text-danger'
                            }
                        >
                            {discountMessage}
                        </small>
                    )}

                    {appliedDiscounts.map((discount) => (
                        <div
                            key={discount.code}
                            className="d-flex justify-content-between align-items-center bg-light rounded-3 p-2 mt-2"
                        >

                            <span className="small fw-semibold">
                                {discount.code} - {discount.percentage}% OFF
                            </span>

                            <button
                                onClick={() => {
                                    setAppliedDiscounts(
                                        appliedDiscounts.filter(
                                            item => item.code !== discount.code
                                        )
                                    )
                                    setDiscountMessage('')
                                }}
                                className="btn btn-sm text-danger"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                        </div>
                    ))}

                </div>

                <div className="d-flex justify-content-between mb-3 text-secondary">
                    <span>Subtotal</span>

                    <span className="fw-bold text-dark">
                        ${totalPrice.toFixed(2)}
                    </span>
                </div>

                {totalDiscount > 0 && (
                    <div className="d-flex justify-content-between mb-3 text-success">

                        <span>
                            Discount
                        </span>

                        <span className="fw-bold">
                            -${totalDiscount.toFixed(2)}
                        </span>

                    </div>
                )}

                <div className="d-flex justify-content-between mb-3 text-secondary">

                    <span>
                        Estimated Shipping
                    </span>

                    <span className="text-success fw-bold">
                        FREE
                    </span>

                </div>

                <hr className="my-3" />

                <div className="d-flex justify-content-between mb-4">

                    <span className="fw-bold fs-5">
                        Total
                    </span>

                    <span
                        className="fw-bold fs-5"
                        style={{ color: '#c2185b' }}
                    >
                        ${finalTotal.toFixed(2)}
                    </span>

                </div>

                <button
                    onClick={onCheckout}
                    className="btn text-white w-100 rounded-pill py-3 fw-bold shadow-sm"
                    style={{ backgroundColor: '#c2185b' }}
                >
                    <i className="fa-solid fa-lock me-2"></i>
                    Proceed to Checkout
                </button>

                <div className="mt-4 pt-3 border-top text-center text-secondary small">

                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <i className="fa-solid fa-shield-halved text-success"></i>
                        <span>
                            Secure checkout guaranteed
                        </span>
                    </div>

                    <div className="d-flex align-items-center justify-content-center gap-2">
                        <i className="fa-solid fa-truck-fast text-secondary"></i>
                        <span>
                            Free delivery on all orders
                        </span>
                    </div>

                </div>

            </div>

        </div>
    )
}