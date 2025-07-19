// stores/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/apiClient';

// Cookie utility functions
const setCookie = (name, value, days = 7) => {
    if (typeof window !== 'undefined') {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
};

const deleteCookie = (name) => {
    if (typeof window !== 'undefined') {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
};

const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Login action
            login: async (email, password) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.post('/auth/login', {
                        email,
                        password
                    });

                    const { data } = response.data;

                    // Extract user data
                    const user = {
                        userId: data.userId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        roles: data.roles,
                        permissions: data.permissions
                    };

                    // Update store state
                    set({
                        user,
                        token: data.token,
                        refreshToken: data.refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null
                    });

                    // Update API client token
                    apiClient.setToken(data.token);

                    // Set token in cookie for middleware
                    setCookie('auth-token', data.token);

                    return { success: true, data: user };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Login failed';
                    set({
                        isLoading: false,
                        error: errorMessage,
                        isAuthenticated: false
                    });
                    return { success: false, error: errorMessage };
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null
                });

                // Clear token from API client
                apiClient.setToken(null);

                // Clear token cookie
                deleteCookie('auth-token');

                // Redirect to login page
                if (typeof window !== 'undefined') {
                    window.location.href = '/luceig-admin/login';
                }
            },

            // Auto logout when token expires
            checkTokenExpiration: () => {
                const { token, logout } = get();

                if (!token) return;

                try {
                    // Decode JWT token (simple base64 decode)
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const currentTime = Date.now() / 1000;

                    if (payload.exp < currentTime) {
                        logout();
                    }
                } catch (error) {
                    console.error('Error checking token expiration:', error);
                    logout();
                }
            },

            // Initialize auth state (call this on app startup)
            initialize: () => {
                const { token, checkTokenExpiration } = get();

                if (token) {
                    // Set token in API client
                    apiClient.setToken(token);

                    // Set token in cookie for middleware
                    setCookie('auth-token', token);

                    // Check if token is still valid
                    checkTokenExpiration();

                    // Set up periodic token expiration check (every 5 minutes)
                    setInterval(() => {
                        checkTokenExpiration();
                    }, 5 * 60 * 1000);
                }
            },

            // Clear error
            clearError: () => set({ error: null }),

            // Check if user has specific permission
            hasPermission: (permission) => {
                const { user } = get();
                return user?.permissions?.includes(permission) || false;
            },

            // Check if user has specific role
            hasRole: (role) => {
                const { user } = get();
                return user?.roles?.includes(role) || false;
            }
        }),
        {
            name: 'auth-storage', // Key in localStorage
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);

export default useAuthStore;