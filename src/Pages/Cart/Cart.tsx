import React, { useEffect, useMemo, useState } from 'react'
import Header from '../../Components/Header/Header'
import { useCart } from '../../Context/useCart'
import CartItems from '../../Components/Cart/CartItems/CartItems'
import OrderSummary from '../../Components/Cart/OrderSummary/OrderSummary'
import EmptyCart from '../../Components/Cart/EmptyCart/EmptyCart'
import OrderSuccess from '../../Components/Cart/OrderSuccess/OrderSuccess'
import { Helmet } from 'react-helmet-async'
import { useAuthContext } from '../../Context/useAuthContext'
import { createOrder, getGovernorates, type Governorate } from '../../api/orders/orders'
import Loading from '../../Components/Loading/Loading'

export default function Cart({ loading }: { loading: boolean }) {
    const {
        cartItems,
        clearCart,
    } = useCart()
    const { user, updateUser } = useAuthContext()

    const [orderPlaced, setOrderPlaced] = useState(false)
    const [governorates, setGovernorates] = useState<Governorate[]>([])
    const [governoratesLoaded, setGovernoratesLoaded] = useState(false)
    const [governoratesError, setGovernoratesError] = useState('')
    const [selectedGovernorate, setSelectedGovernorate] = useState(user?.governorate ?? '')
    const [city, setCity] = useState(user?.city ?? '')
    const [address, setAddress] = useState(user?.address ?? '')
    const [phone, setPhone] = useState(user?.phone ?? '')
    const [checkoutError, setCheckoutError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        async function loadGovernorates() {
            try {
                const response = await getGovernorates()
                setGovernorates(response.governorates)
            } catch {
                setGovernorates([])
                setGovernoratesError('Shipping rates are unavailable. Please try again before placing your order.')
            } finally {
                setGovernoratesLoaded(true)
            }
        }

        void loadGovernorates()
    }, [])

    useEffect(() => {
        if (!user) return

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedGovernorate(user.governorate ?? '')
        setCity(user.city ?? '')
        setAddress(user.address ?? '')
        setPhone(user.phone ?? '')
    }, [user])

    const shippingCost = useMemo(() => {
        return governorates.find((item) => item.code === selectedGovernorate)?.shipping_rate ?? null
    }, [governorates, selectedGovernorate])

    async function handleCheckout() {
        if (!user) {
            setCheckoutError('Please log in to complete your order.')
            return
        }

        if (!selectedGovernorate || !city.trim() || !address.trim() || !phone.trim()) {
            setCheckoutError('Complete your governorate, city, address, and phone before checkout.')
            return
        }

        if (!/^01\d{9}$/.test(phone.trim())) {
            setCheckoutError('Phone number must be a valid Egyptian mobile number.')
            return
        }

        if (cartItems.length === 0) {
            setCheckoutError('Your cart is empty.')
            return
        }

        const savedDiscounts = JSON.parse(localStorage.getItem('hagoraDiscounts') ?? '[]') as Array<{ code: string }>
        const latestDiscount = savedDiscounts.at(-1)?.code ?? null

        setCheckoutError('')
        setIsSubmitting(true)

        try {
            await createOrder({
                idempotency_key: `checkout-${user.id}-${Date.now()}`,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: phone.trim(),
                governorate_code: selectedGovernorate,
                city: city.trim(),
                address: address.trim(),
                items: cartItems.map((item) => ({
                    product_id: Number(item.id),
                    quantity: item.quantity,
                })),
                discount_code: latestDiscount,
            })

            updateUser({
                ...user,
                governorate: selectedGovernorate,
                city: city.trim(),
                address: address.trim(),
                phone: phone.trim(),
            })

            setOrderPlaced(true)
            clearCart()
        } catch (error) {
            setCheckoutError(
                error instanceof Error ? error.message : 'Unable to place your order right now.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="my-5">
            <Helmet>
                <title>HAGORA - Shopping Cart</title>
                <meta name="description" content="Review and manage your selected beauty products before checkout" />
            </Helmet>
            <Header
                title="Shopping Cart"
                description="Review and manage your selected beauty products"
            />

            {orderPlaced && (
                <OrderSuccess
                    onClose={() => setOrderPlaced(false)}
                />
            )}

            {cartItems.length === 0 && !orderPlaced && (
                <EmptyCart />
            )}

            {cartItems.length > 0 && (
                <div className="row g-4 align-items-start">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 p-4">
                            <h5 className="fw-bold mb-3">Delivery Details</h5>

                            {checkoutError && (
                                <div className="alert alert-danger rounded-3 mb-3" role="alert">
                                    {checkoutError}
                                </div>
                            )}
                            {governoratesError && (
                                <div className="alert alert-danger rounded-3 mb-3" role="alert">
                                    {governoratesError}
                                </div>
                            )}

                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Governorate</label>
                                    <select
                                        className="form-select rounded-3"
                                        value={selectedGovernorate}
                                        onChange={(event) => setSelectedGovernorate(event.target.value)}
                                    >
                                        <option value="">Select governorate</option>
                                        {governorates.map((governorate) => (
                                            <option key={governorate.code} value={governorate.code}>
                                                {governorate.name_en} ({governorate.name_ar})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">City</label>
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        value={city}
                                        onChange={(event) => setCity(event.target.value)}
                                        placeholder="Nasr City"
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">Delivery Address</label>
                                    <textarea
                                        className="form-control rounded-3"
                                        value={address}
                                        onChange={(event) => setAddress(event.target.value)}
                                        placeholder="Building 12, Street 7, Fifth Settlement"
                                        rows={3}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-semibold">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-control rounded-3"
                                        value={phone}
                                        onChange={(event) => setPhone(event.target.value)}
                                        placeholder="01xxxxxxxxx"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <CartItems />
                        </div>
                    </div>

                    <OrderSummary
                        onCheckout={handleCheckout}
                        shippingCost={shippingCost}
                        disabled={isSubmitting || !governoratesLoaded || Boolean(governoratesError)}
                    />
                </div>
            )}
        </div>
    )
}