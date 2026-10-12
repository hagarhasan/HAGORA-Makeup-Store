import React, { useState, useEffect } from 'react'
import { useCart } from '../../../Context/useCart'

interface AppliedDiscount {
    code: string
    percentage: number
}

export default function OrderSummary({
    onCheckout,
    shippingCost = null,
    disabled = false,
}: {
    onCheckout: () => void
    shippingCost?: number | null
    disabled?: boolean
}) {
    const { totalPrice } = useCart()
    const [discountCode, setDiscountCode] = useState('')
    const [appliedDiscounts, setAppliedDiscounts] = useState<AppliedDiscount[]>(() => {
        const savedDiscounts = localStorage.getItem('hagoraDiscounts')

        return savedDiscounts ? (JSON.parse(savedDiscounts) as AppliedDiscount[]) : []
    })

    useEffect(() => {
        localStorage.setItem('hagoraDiscounts', JSON.stringify(appliedDiscounts))
    }, [appliedDiscounts])

    const [discountMessage, setDiscountMessage] = useState('')

    const discountCodes: Record<string, number> = {
        HAGORA20: 20,
    }

    function handleApplyDiscount() {
        const code = discountCode.trim().toUpperCase()

        if (!discountCodes[code]) {
            setDiscountMessage('Invalid discount code')
            return
        }

        const alreadyApplied = appliedDiscounts.some((discount) => discount.code === code)

        if (alreadyApplied) {
            setDiscountMessage('This discount code is already applied')
            return
        }

        setAppliedDiscounts((prev) => [
            ...prev,
            {
                code,
                percentage: discountCodes[code],
            },
        ])

        setDiscountCode('')
        setDiscountMessage('Discount applied successfully!')
    }

    const totalDiscount = appliedDiscounts.reduce((total, discount) => {
        return total + (totalPrice * discount.percentage) / 100
    }, 0)

    const finalTotal = totalPrice + Math.max(0, shippingCost ?? 0) - totalDiscount

    return (
        <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 sticky-top" style={{ top: '90px' }}>
                <h5 className="fw-bold mb-4">Order Summary</h5>

                <div className="mb-4">
                    <label className="form-label fw-semibold">Discount Code</label>

                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control rounded-start-pill"
                            placeholder="Enter code"
                            value={discountCode}
                            onChange={(event) => {
                                setDiscountCode(event.target.value)
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
                                    setAppliedDiscounts((prev) =>
                                        prev.filter((item) => item.code !== discount.code),
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
                    <span className="fw-bold text-dark">EGP {totalPrice.toFixed(2)}</span>
                </div>

                {totalDiscount > 0 && (
                    <div className="d-flex justify-content-between mb-3 text-success">
                        <span>Discount</span>
                        <span className="fw-bold">-EGP {totalDiscount.toFixed(2)}</span>
                    </div>
                )}

                <div className="d-flex justify-content-between mb-3 text-secondary">
                    <span>Placeholder Shipping Rate</span>
                    <span className={shippingCost !== null ? 'fw-bold text-dark' : 'text-secondary fw-bold'}>
                        {shippingCost === null ? 'Select governorate' : `EGP ${shippingCost.toFixed(2)}`}
                    </span>
                </div>
                <small className="d-block text-secondary text-end mb-3">
                    Development estimate only. Confirm the actual courier charge before accepting orders.
                </small>

                <hr className="my-3" />

                <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold fs-5">Total</span>
                    <span className="fw-bold fs-5" style={{ color: '#c2185b' }}>
                        EGP {finalTotal.toFixed(2)}
                    </span>
                </div>

                <button
                    onClick={onCheckout}
                    disabled={disabled}
                    className="btn text-white w-100 rounded-pill py-3 fw-bold shadow-sm"
                    style={{ backgroundColor: '#c2185b' }}
                >
                    <i className="fa-solid fa-lock me-2"></i>
                    {disabled ? 'Processing...' : 'Proceed to Checkout'}
                </button>

                <div className="mt-4 pt-3 border-top text-center text-secondary small">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <i className="fa-solid fa-shield-halved text-success"></i>
                        <span>Secure checkout guaranteed</span>
                    </div>

                    <div className="d-flex align-items-center justify-content-center gap-2">
                        <i className="fa-solid fa-truck-fast text-secondary"></i>
                        <span>Cash on delivery available</span>
                    </div>
                </div>
            </div>
        </div>
    )
}