import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faArrowRight,
    faBoxOpen,
    faCalendarDays,
    faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { getOrders, type OrderRecord } from '../../../api/orders/orders'
import './MyOrders.css'

type OrderStatus =
    | 'Pending'
    | 'Processing'
    | 'Delivered'
    | 'Cancelled'

const filters = [
    'All Orders',
    'Pending',
    'Processing',
    'Delivered',
    'Cancelled',
] as const

type OrderFilter = (typeof filters)[number]

function formatPrice(price: number): string {
    return `${price.toLocaleString('en-US')} EGP`
}

function formatDate(date: string | null): string {
    if (!date) return 'N/A'
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date))
}

function formatStatusLabel(status: string): OrderStatus {
    const normalized = status.toLowerCase()
    if (normalized === 'pending') return 'Pending'
    if (normalized === 'processing') return 'Processing'
    if (normalized === 'delivered') return 'Delivered'
    return 'Cancelled'
}

export default function MyOrders(): React.JSX.Element {
    const [filter, setFilter] = useState<OrderFilter>('All Orders')
    const [search, setSearch] = useState('')
    const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null)
    const [orders, setOrders] = useState<OrderRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [retryCount, setRetryCount] = useState(0)

    // No synchronous setState in the effect body: `loading` starts as true
    // and the retry button resets it before bumping retryCount.
    useEffect(() => {
        let cancelled = false

        getOrders()
            .then((response) => {
                if (cancelled) return
                setOrders(response.orders)
                setError('')
            })
            .catch(() => {
                if (!cancelled) setError('Unable to load your orders right now.')
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [retryCount])

    // Close the details modal with the Escape key.
    useEffect(() => {
        if (!selectedOrder) return

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') setSelectedOrder(null)
        }

        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [selectedOrder])

    function handleRetry() {
        setError('')
        setLoading(true)
        setRetryCount((count) => count + 1)
    }

    const searchValue = search.trim().toLowerCase()

    const filteredOrders = orders.filter((order) => {
        const status = formatStatusLabel(order.status)
        const matchesFilter = filter === 'All Orders' || status === filter
        const matchesSearch =
            order.order_number.toLowerCase().includes(searchValue) ||
            order.items.some((item) =>
                item.product_name.toLowerCase().includes(searchValue),
            )

        return matchesFilter && matchesSearch
    })

    const totalOrders = orders.length
    const deliveredOrders = orders.filter(
        (order) => formatStatusLabel(order.status) === 'Delivered',
    ).length
    const activeOrders = orders.filter((order) => {
        const status = formatStatusLabel(order.status)
        return status === 'Pending' || status === 'Processing'
    }).length

    return (
        <div className="my-orders">
            <div className="orders-page-heading">
                <div>
                    <p className="orders-eyebrow">YOUR PURCHASES</p>
                    <h2>My Orders</h2>
                    <p className="orders-description">
                        Track your orders and review your purchase history.
                    </p>
                </div>

                <span className="orders-count">{totalOrders} Orders</span>
            </div>

            <div className="orders-stats">
                <article className="orders-stat-card">
                    <span className="orders-stat-icon">
                        <FontAwesomeIcon icon={faBoxOpen} />
                    </span>
                    <div>
                        <p>Total Orders</p>
                        <strong>{totalOrders}</strong>
                    </div>
                </article>

                <article className="orders-stat-card">
                    <span className="orders-stat-icon">
                        <FontAwesomeIcon icon={faCalendarDays} />
                    </span>
                    <div>
                        <p>In Progress</p>
                        <strong>{activeOrders}</strong>
                    </div>
                </article>

                <article className="orders-stat-card">
                    <span className="orders-stat-icon">
                        <FontAwesomeIcon icon={faBoxOpen} />
                    </span>
                    <div>
                        <p>Delivered</p>
                        <strong>{deliveredOrders}</strong>
                    </div>
                </article>
            </div>

            <section className="orders-card">
                <div className="orders-toolbar">
                    <div>
                        <h3>Order History</h3>
                        <p>View and manage your recent purchases.</p>
                    </div>

                    <label className="orders-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        <input
                            type="search"
                            placeholder="Search orders..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            aria-label="Search orders"
                        />
                    </label>
                </div>

                <div className="orders-filters" role="group" aria-label="Filter orders">
                    {filters.map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={`orders-filter${filter === item ? ' active' : ''}`}
                            onClick={() => setFilter(item)}
                            aria-pressed={filter === item}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="orders-empty" role="alert">
                        <p>{error}</p>
                        <button
                            type="button"
                            className="orders-retry-button"
                            onClick={handleRetry}
                        >
                            Try again
                        </button>
                    </div>
                )}

                {loading && (
                    <p className="orders-empty" role="status">
                        Loading orders...
                    </p>
                )}

                {!loading && !error && (
                    <div className="orders-list">
                        {filteredOrders.map((order) => {
                            const status = formatStatusLabel(order.status)
                            const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

                            return (
                                <article className="order-row" key={order.id}>
                                    <div className="order-icon">
                                        <FontAwesomeIcon icon={faBoxOpen} />
                                    </div>

                                    <div className="order-main">
                                        <h4>{order.order_number}</h4>
                                        <p>{order.items.map((item) => item.product_name).join(', ')}</p>
                                        <span className="order-date">
                                            {formatDate(order.created_at)} · {totalItems}{' '}
                                            {totalItems === 1 ? 'item' : 'items'}
                                        </span>
                                    </div>

                                    <div className="order-total">
                                        <strong>{formatPrice(order.total)}</strong>
                                        <span className={`order-status order-status-${status.toLowerCase()}`}>
                                            {status}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        className="order-details-button"
                                        onClick={() => setSelectedOrder(order)}
                                        aria-label={`View details for ${order.order_number}`}
                                    >
                                        <FontAwesomeIcon icon={faArrowRight} />
                                    </button>
                                </article>
                            )
                        })}

                        {filteredOrders.length === 0 && (
                            <div className="orders-empty">
                                <FontAwesomeIcon icon={faBoxOpen} />
                                <h4>
                                    {orders.length === 0 ? 'No orders yet' : 'No orders found'}
                                </h4>
                                <p>
                                    {orders.length === 0
                                        ? 'When you place an order, it will show up here.'
                                        : 'Try changing your search or order status filter.'}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {selectedOrder && (
                <div className="order-modal-backdrop" onClick={() => setSelectedOrder(null)}>
                    <section
                        className="order-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="order-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="order-modal-close"
                            onClick={() => setSelectedOrder(null)}
                            aria-label="Close order details"
                        >
                            ×
                        </button>

                        <p className="orders-eyebrow">ORDER DETAILS</p>
                        <h3 id="order-modal-title">{selectedOrder.order_number}</h3>

                        <div className="order-modal-info">
                            <span>Order date</span>
                            <strong>{formatDate(selectedOrder.created_at)}</strong>

                            <span>Status</span>
                            <strong>{formatStatusLabel(selectedOrder.status)}</strong>

                            <span>Number of items</span>
                            <strong>{selectedOrder.items.reduce((sum, item) => sum + item.quantity, 0)}</strong>

                            <span>Shipping</span>
                            <strong>{formatPrice(selectedOrder.shipping_cost)}</strong>

                            <span>Total</span>
                            <strong>{formatPrice(selectedOrder.total)}</strong>
                        </div>

                        <div className="order-modal-products">
                            <h4>Products</h4>
                            {selectedOrder.items.map((item) => (
                                <p key={item.id}>{item.product_name} × {item.quantity}</p>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="orders-modal-done"
                            onClick={() => setSelectedOrder(null)}
                        >
                            Close Details
                        </button>
                    </section>
                </div>
            )}
        </div>
    )
}