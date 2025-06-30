// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { AuthUtils } from '../utils/auth';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(AuthUtils.isLoggedIn());
    const [user, setUser] = useState(AuthUtils.getCurrentUser());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            setIsLoggedIn(AuthUtils.isLoggedIn());
            setUser(AuthUtils.getCurrentUser());
        };

        // Check auth status on mount
        checkAuth();

        // Listen for storage changes (logout from another tab)
        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const login = (userData) => {
        AuthUtils.setUserSession(userData);
        setIsLoggedIn(true);
        setUser(userData);
    };

    const logout = () => {
        AuthUtils.logout();
        setIsLoggedIn(false);
        setUser(null);
        // Redirect to home page
        window.location.href = '/';
    };

    return {
        isLoggedIn,
        user,
        loading,
        login,
        logout,
        userRole: user?.role,
        hasRole: (role) => AuthUtils.hasRole(role),
        canAccessRoute: (roles) => AuthUtils.canAccessRoute(roles)
    };
};