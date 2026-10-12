import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "../../Context/useAuthContext";

export default function AppRouteGuard(): React.JSX.Element {
    const { isAuthenticated, profileCompleted } = useAuthContext();
    const location = useLocation();

    const isPasswordRecoveryPage =
        location.pathname === "/forgot-password" ||
        location.pathname === "/reset-password";

    const isAuthPage =
        location.pathname === "/login" ||
        location.pathname === "/register";

    const isCompleteProfilePage =
        location.pathname === "/complete-profile";

    const isCartPage =
        location.pathname === "/cart";

    const isDashboardPage =
        location.pathname.startsWith("/dashboard");

    if (isPasswordRecoveryPage) {
        return <Outlet />;
    }

    if (!isAuthenticated) {
        if (isAuthPage) {
            return <Outlet />;
        }

        if (isCartPage || isDashboardPage) {
            return <Navigate to="/login" replace />;
        }

        return <Outlet />;
    }

    if (!profileCompleted) {
        if (isCompleteProfilePage || location.pathname === "/register") {
            return <Outlet />;
        }

        return <Navigate to="/complete-profile" replace />;
    }

    if (isAuthPage || isCompleteProfilePage) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
