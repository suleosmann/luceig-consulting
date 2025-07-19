// stores/companyStore.js
import { create } from 'zustand';
import { apiClient } from '@/lib/apiClient';

const useCompanyStore = create((set, get) => ({
    // State
    companies: [],
    currentCompany: null,
    isLoading: false,
    error: null,
    totalCompanies: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10,

    // Get all companies with filtering and pagination
    fetchCompanies: async (filters = {}, page = 0, size = 10, sortBy = 'name', sortDirection = 'asc') => {
        set({ isLoading: true, error: null });

        try {
            // Build query parameters
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                sortBy,
                sortDirection,
                ...filters
            });

            const response = await apiClient.get(`/company?${params}`);
            const { data } = response.data;

            set({
                companies: data.content,
                totalCompanies: data.totalElements,
                totalPages: data.totalPages,
                currentPage: data.number,
                pageSize: data.size,
                isLoading: false,
                error: null
            });

            return { success: true, data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch companies';
            set({
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },

    // Get company by ID
    fetchCompanyById: async (companyId) => {
        set({ isLoading: true, error: null });

        try {
            const response = await apiClient.get(`/company/${companyId}`);
            const { data } = response.data;

            set({
                currentCompany: data,
                isLoading: false,
                error: null
            });

            return { success: true, data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch company';
            set({
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },

    // Create new company
    createCompany: async (companyData) => {
        set({ isLoading: true, error: null });

        try {
            const response = await apiClient.post('/company', companyData);
            const { data } = response.data;

            // Add new company to the companies array
            set(state => ({
                companies: [...state.companies, data],
                totalCompanies: state.totalCompanies + 1,
                isLoading: false,
                error: null
            }));

            return { success: true, data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create company';
            set({
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },

    // Update company
    updateCompany: async (companyId, companyData) => {
        set({ isLoading: true, error: null });

        try {
            const response = await apiClient.put(`/company/${companyId}`, companyData);
            const { data } = response.data;

            // Update company in the companies array
            set(state => ({
                companies: state.companies.map(company =>
                    company.id === companyId ? { ...company, ...data } : company
                ),
                currentCompany: state.currentCompany?.id === companyId ? { ...state.currentCompany, ...data } : state.currentCompany,
                isLoading: false,
                error: null
            }));

            return { success: true, data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update company';
            set({
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },

    // Delete company
    deleteCompany: async (companyId) => {
        set({ isLoading: true, error: null });

        try {
            await apiClient.delete(`/company/${companyId}`);

            // Remove company from the companies array
            set(state => ({
                companies: state.companies.filter(company => company.id !== companyId),
                totalCompanies: state.totalCompanies - 1,
                currentCompany: state.currentCompany?.id === companyId ? null : state.currentCompany,
                isLoading: false,
                error: null
            }));

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete company';
            set({
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },

    // Check if company exists by name
    checkCompanyExists: async (name) => {
        set({ isLoading: true, error: null });

        try {
            const response = await apiClient.get(`/company/exists?name=${encodeURIComponent(name)}`);
            const { data } = response.data;

            set({
                isLoading: false,
                error: null
            });

            return { success: true, exists: data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to check company existence';
            set({
                isLoading: false,
                error: errorMessage
            });
            return { success: false, error: errorMessage };
        }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Clear current company
    clearCurrentCompany: () => set({ currentCompany: null }),

    // Search companies (client-side filtering)
    searchCompanies: (searchTerm) => {
        const { companies } = get();
        if (!searchTerm) return companies;

        return companies.filter(company =>
            company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (company.location && company.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    },

    // Filter companies by industry
    filterCompaniesByIndustry: (industry) => {
        const { companies } = get();
        if (!industry || industry === 'ALL') return companies;

        return companies.filter(company =>
            company.industry && company.industry.toLowerCase() === industry.toLowerCase()
        );
    },

    // Filter companies by location
    filterCompaniesByLocation: (location) => {
        const { companies } = get();
        if (!location || location === 'ALL') return companies;

        return companies.filter(company =>
            company.location && company.location.toLowerCase() === location.toLowerCase()
        );
    },

    // Get unique industries from current companies
    getUniqueIndustries: () => {
        const { companies } = get();
        const industries = companies
            .map(company => company.industry)
            .filter(industry => industry)
            .filter((industry, index, arr) => arr.indexOf(industry) === index);

        return industries.sort();
    },

    // Get unique locations from current companies
    getUniqueLocations: () => {
        const { companies } = get();
        const locations = companies
            .map(company => company.location)
            .filter(location => location)
            .filter((location, index, arr) => arr.indexOf(location) === index);

        return locations.sort();
    },

    // Reset pagination
    resetPagination: () => set({
        currentPage: 0,
        totalPages: 0,
        totalCompanies: 0
    }),

    // Set page size
    setPageSize: (size) => set({ pageSize: size })
}));

export default useCompanyStore;