// lib/apiClient.js
import axios from 'axios';
import useAuthStore from '@/stores/authStore';

// Create axios instance
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token management
let currentToken = null;

apiClient.setToken = (token) => {
    currentToken = token;
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common['Authorization'];
    }
};

// Request interceptor - automatically add token to requests
apiClient.interceptors.request.use(
    (config) => {
        // Get fresh token from store if not set
        if (!currentToken) {
            const authStore = useAuthStore.getState();
            if (authStore.token) {
                currentToken = authStore.token;
                config.headers.Authorization = `Bearer ${currentToken}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle token expiration
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Token expired or invalid, logout user
            const authStore = useAuthStore.getState();
            authStore.logout();
        }

        return Promise.reject(error);
    }
);

export { apiClient };