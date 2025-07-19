// stores/userStore.js
import { create } from 'zustand';
import { apiClient } from '@/lib/apiClient';

const useUserStore = create((set, get) => ({
    // State
    users: [],
    currentUser: null,
    isLoading: false,
    error: null,
    totalUsers: 0,

    // Get all users
    fetchUsers: async () => {
        set({ isLoading: true, error: null });

        try {
            const response = await apiClient.get('/user');
            const { data } = response.data;

            set({
                users: data,
                totalUsers: data.length,
                isLoading: false,
                error: null
            });

            return { success: true, data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch users';
            set({
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },

    // Get user by ID
    fetchUserById: async (userId) => {
        set({ isLoading: true, error: null });

        try {
            const response = await apiClient.get(`/user/${userId}`);
            const { data } = response.data;

            set({
                currentUser: data,
                isLoading: false,
                error: null
            });

            return { success: true, data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch user';
            set({
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },

    // Create new user
    createUser: async (userData) => {
        set({ isLoading: true, error: null });

        try {
            const response = await apiClient.post('/user/create', userData);
            const { data } = response.data;

            // Add new user to the users array
            set(state => ({
                users: [...state.users, data],
                totalUsers: state.totalUsers + 1,
                isLoading: false,
                error: null
            }));

            return { success: true, data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create user';
            set({
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },

    // Update user
    updateUser: async (userId, userData) => {
        set({ isLoading: true, error: null });

        try {
            const response = await apiClient.put(`/user/${userId}`, userData);
            const { data } = response.data;

            // Update user in the users array
            set(state => ({
                users: state.users.map(user =>
                    user.id === userId ? { ...user, ...data } : user
                ),
                currentUser: state.currentUser?.id === userId ? { ...state.currentUser, ...data } : state.currentUser,
                isLoading: false,
                error: null
            }));

            return { success: true, data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update user';
            set({
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },

    // Set password (for setup-password page)
    setPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null });

        try {
            const response = await apiClient.post(`/user/set-password?token=${token}&newPassword=${encodeURIComponent(newPassword)}`);

            set({
                isLoading: false,
                error: null
            });

            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to set password';
            set({
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },

    // Forgot password
    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });

        try {
            const response = await apiClient.post(`/user/forgot-password?email=${encodeURIComponent(email)}`);

            set({
                isLoading: false,
                error: null
            });

            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send reset email';
            set({
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Clear current user
    clearCurrentUser: () => set({ currentUser: null }),

    // Search users (client-side filtering)
    searchUsers: (searchTerm) => {
        const { users } = get();
        if (!searchTerm) return users;

        return users.filter(user =>
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    },

    // Filter users by status
    filterUsersByStatus: (status) => {
        const { users } = get();
        if (!status || status === 'ALL') return users;

        return users.filter(user => user.status === status);
    },

    // Filter users by role
    filterUsersByRole: (roleName) => {
        const { users } = get();
        if (!roleName || roleName === 'ALL') return users;

        return users.filter(user =>
            user.roles.some(role => role.name === roleName)
        );
    }
}));

export default useUserStore;