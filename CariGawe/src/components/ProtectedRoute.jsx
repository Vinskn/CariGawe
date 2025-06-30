// src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUtils } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        if (!AuthUtils.isLoggedIn()) {
            navigate('/', { replace: true });
            return;
        }

        // Check role-based access
        if (allowedRoles.length > 0 && !AuthUtils.canAccessRoute(allowedRoles)) {
            // Redirect to appropriate dashboard based on user role
            const userRole = AuthUtils.getUserRole();
            const redirectPath = AuthUtils.getRedirectPath(userRole);
            navigate(redirectPath, { replace: true });
            return;
        }
    }, [navigate, allowedRoles]);

    // Don't render anything if not authenticated
    if (!AuthUtils.isLoggedIn()) {
        return null;
    }

    // Don't render if user doesn't have required role
    if (allowedRoles.length > 0 && !AuthUtils.canAccessRoute(allowedRoles)) {
        return null;
    }

    return children;
};

export default ProtectedRoute;