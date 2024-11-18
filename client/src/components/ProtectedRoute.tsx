import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
    const { user } = useAuthContext();
    const location = useLocation();

    if (requireAuth ? !user?.isAuthenticated : user?.isAuthenticated) {
        if (requireAuth) {
            // Salva l'URL richiesto nel sessionStorage
            sessionStorage.setItem('redirectUrl', location.pathname);
            return <Navigate to="/login" replace />;
        }
        return <Navigate to="/" replace />;
    }

    // Se requireAuth è true, verifica che l'utente sia autenticato
    // Se requireAuth è false, verifica che l'utente NON sia autenticato
    if (requireAuth ? !user?.isAuthenticated : user?.isAuthenticated) {
        return <Navigate to={requireAuth ? '/login' : '/'} replace />;
    }

    return <>{children}</>;
};
