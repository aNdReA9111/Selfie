import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const { user } = useAuthContext();
  
  // Se requireAuth è true, verifica che l'utente sia autenticato
  // Se requireAuth è false, verifica che l'utente NON sia autenticato
  if (requireAuth ? !user?.isAuthenticated : user?.isAuthenticated) {
    return <Navigate to={requireAuth ? '/login' : '/'} replace />;
  }

  return <>{children}</>;
};