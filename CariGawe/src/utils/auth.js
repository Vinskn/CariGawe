// src/utils/auth.js
import supabase from '../utils/supabaseClient'

export const AuthUtils = {
    // Check if user is logged in
    isLoggedIn: () => {
        return localStorage.getItem('isLoggedIn') === 'true';
    },

    // Get current user data
    getCurrentUser: () => {
        const userData = localStorage.getItem('user');
        if (!userData) return null;
        
        const user = JSON.parse(userData);
        return user;
    },

    // Get user role
    getUserRole: () => {
        const user = AuthUtils.getCurrentUser();
        return user ? user.role : null;
    },

    // Set user session
    setUserSession: async (userData) => {
        if (userData.role === 'perusahaan') {
            // Ambil ID perusahaan dari tabel 'perusahaan' berdasarkan user_id
            const { data, error } = await supabase
                .from('perusahaan')
                .select('id') // ambil ID perusahaan, bukan user_id
                .eq('user_id', userData.id)
                .single();

            if (error) {
                console.error("Error fetching perusahaan data:", error);
            }

            if (data) {
                userData.company_id = data.user_id; // simpan id perusahaan, bukan user_id
            }
        }

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        // Dispatch storage event for other tabs
        window.dispatchEvent(new Event('storage'));
    },

    // Check if user has specific role
    hasRole: (requiredRole) => {
        const userRole = AuthUtils.getUserRole();
        return userRole === requiredRole;
    },

    // Check if user can access route based on role
    canAccessRoute: (requiredRoles) => {
        if (!requiredRoles || requiredRoles.length === 0) return true;
        const userRole = AuthUtils.getUserRole();
        return requiredRoles.includes(userRole);
    },

    // Get redirect path based on user role
    getRedirectPath: (userRole) => {
        switch (userRole) {
            case 'pelamar':
                return '/home';
            case 'perusahaan':
                return '/employeer';
            case 'admin':
                return '/admin';
            default:
                return '/home';
        }
    }
};