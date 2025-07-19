// components/AuthProvider.jsx
"use client";
import { useEffect } from 'react';
import useAuthStore from '@/stores/authStore';

export default function AuthProvider({ children }) {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        // Initialize auth store on app startup
        initialize();
    }, [initialize]);

    return <>{children}</>;
}