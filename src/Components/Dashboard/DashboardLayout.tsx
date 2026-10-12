import { Link, NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom'
import { useAuthContext } from '../../Context/useAuthContext'
import './DashboardLayout.css'

export default function DashboardLayout(): React.JSX.Element {
    const { user, isAuthenticated, logout } = useAuthContext()
    const navigate = useNavigate()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    const fullName =
        [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
        user?.username ||
        'Customer'

    const initials =
        [user?.first_name?.[0], user?.last_name?.[0]].filter(Boolean).join('').toUpperCase() ||
        user?.username?.slice(0, 2).toUpperCase() ||
        'CU'

    return (
        <div className="dashboard">
            <a href="#dashboard-main-content" className="dashboard-skip-link">
                Skip to content
            </a>

            <aside className="dashboard-sidebar" aria-label="Dashboard Sidebar">
                <div className="d-flex align-items-center justify-content-between">
                    <Link to="/" className="dashboard-brand">
                        HAGORA<span>.</span>
                    </Link>

                    <div className="d-flex d-md-none align-items-center gap-2 mb-2">
                        <Link to="/" className="dashboard-store-link" title="Store">
                            <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                            <span>Store</span>
                        </Link>
                        <button
                            type="button"
                            className="dashboard-logout-button"
                            onClick={handleLogout}
                            title="Sign Out"
                            style={{ width: 'auto', padding: '6px 10px', fontSize: '12px' }}
                        >
                            <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div className="dashboard-user">
                    <div className="dashboard-user-avatar" aria-hidden="true">
                        {initials}
                    </div>
                    <div className="dashboard-user-text">
                        <strong>{fullName}</strong>
                        <span>{user?.email || 'Customer'}</span>
                    </div>
                </div>

                <p className="dashboard-menu-title">MENU</p>

                <nav className="dashboard-nav" aria-label="Dashboard Navigation">
                    <NavLink
                        to="/dashboard/profile"
                        className={({ isActive }) =>
                            `dashboard-nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="dashboard-nav-icon">
                            <i className="fa-solid fa-user" aria-hidden="true" />
                        </span>
                        <div className="dashboard-nav-text">
                            <span className="dashboard-nav-label">Profile</span>
                            <small>Personal details</small>
                        </div>
                    </NavLink>

                    <NavLink
                        to="/dashboard/orders"
                        className={({ isActive }) =>
                            `dashboard-nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="dashboard-nav-icon">
                            <i className="fa-solid fa-box-open" aria-hidden="true" />
                        </span>
                        <div className="dashboard-nav-text">
                            <span className="dashboard-nav-label">My Orders</span>
                            <small>Track your purchases</small>
                        </div>
                    </NavLink>

                    <NavLink
                        to="/dashboard/settings"
                        className={({ isActive }) =>
                            `dashboard-nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="dashboard-nav-icon">
                            <i className="fa-solid fa-gear" aria-hidden="true" />
                        </span>
                        <div className="dashboard-nav-text">
                            <span className="dashboard-nav-label">Settings</span>
                            <small>Password & preferences</small>
                        </div>
                    </NavLink>
                </nav>

                <div className="dashboard-sidebar-bottom">
                    <Link to="/" className="dashboard-store-link">
                        <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                        <span>Back to Store</span>
                    </Link>

                    <button
                        type="button"
                        className="dashboard-logout-button"
                        onClick={handleLogout}
                    >
                        <i className="fa-solid fa-right-from-bracket" aria-hidden="true" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main id="dashboard-main-content" className="dashboard-main">
                <div className="dashboard-content" tabIndex={-1}>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}