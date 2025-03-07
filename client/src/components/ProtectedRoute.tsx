import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
    const { user } = useAuthContext();
    const location = useLocation();

    if (requireAuth && !user?.isAuthenticated) {
        // If not authenticated, redirect to /login saving the requested page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!requireAuth && user?.isAuthenticated) {
        // If authenticated and trying to access a public route, redirect to home or saved route
        const from = location.state?.from?.pathname || "/";
        return <Navigate to={from} replace />;
    }

    return <>{children}</>;
};