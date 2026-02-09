import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
    const { user, isAdmin } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
}
