// stores/candidateStore.js
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { apiClient } from '@/lib/apiClient';

const useCandidateStore = create(
    devtools(
        subscribeWithSelector((set, get) => ({
            // State
            candidates: [],
            currentCandidate: null,
            isLoading: false,
            error: null,
            totalCandidates: 0,
            totalPages: 0,
            currentPage: 0,
            pageSize: 10,
            statistics: null,

            // Cached data for performance
            cachedApplications: new Map(),
            cachedCompanies: new Set(),
            cachedJobTitles: new Set(),
            lastFetchTime: null,

            // UI state
            sortBy: 'createdAt',
            sortDirection: 'desc',
            activeFilters: {},

            // Actions

            // Get all candidates with filtering and pagination
            fetchCandidates: async (filters = {}, page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => {
                const currentState = get();

                // Skip if same request is already loading
                if (currentState.isLoading) return { success: false, error: 'Already loading' };

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

                    const response = await apiClient.get(`/candidate?${params}`);
                    const { data } = response.data;

                    // Update cached data
                    const companiesSet = new Set();
                    const jobTitlesSet = new Set();
                    const applicationsMap = new Map();

                    data.content.forEach(candidate => {
                        // Cache applications for this candidate
                        if (candidate.applications && candidate.applications.length > 0) {
                            applicationsMap.set(candidate.id, candidate.applications);

                            // Extract unique companies and job titles
                            candidate.applications.forEach(app => {
                                if (app.companyName) companiesSet.add(app.companyName);
                                if (app.jobTitle) jobTitlesSet.add(app.jobTitle);
                            });
                        }
                    });

                    set({
                        candidates: data.content,
                        totalCandidates: data.totalElements,
                        totalPages: data.totalPages,
                        currentPage: data.number,
                        pageSize: data.size,
                        isLoading: false,
                        error: null,
                        lastFetchTime: Date.now(),
                        cachedApplications: applicationsMap,
                        cachedCompanies: companiesSet,
                        cachedJobTitles: jobTitlesSet,
                        sortBy,
                        sortDirection,
                        activeFilters: filters
                    });

                    return { success: true, data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch candidates';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Get candidate by ID with caching
            fetchCandidateById: async (candidateId, useCache = true) => {
                const currentState = get();

                // Check cache first
                if (useCache && currentState.currentCandidate?.id === candidateId) {
                    return { success: true, data: currentState.currentCandidate };
                }

                // Check if candidate exists in candidates array
                const cachedCandidate = currentState.candidates.find(candidate => candidate.id === candidateId);
                if (useCache && cachedCandidate) {
                    set({ currentCandidate: cachedCandidate });
                    return { success: true, data: cachedCandidate };
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.get(`/candidate/${candidateId}`);
                    const { data } = response.data;

                    set({
                        currentCandidate: data,
                        isLoading: false,
                        error: null
                    });

                    return { success: true, data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch candidate';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Fetch candidate statistics
            fetchCandidateStatistics: async () => {
                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.get('/candidate/statistics');
                    const { data } = response.data;

                    set({
                        statistics: data,
                        isLoading: false,
                        error: null
                    });

                    return { success: true, data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch candidate statistics';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Refresh current view
            refreshCandidates: async () => {
                const { activeFilters, currentPage, pageSize, sortBy, sortDirection } = get();
                return get().fetchCandidates(activeFilters, currentPage, pageSize, sortBy, sortDirection);
            },

            // Utility functions

            // Clear error
            clearError: () => set({ error: null }),

            // Clear current candidate
            clearCurrentCandidate: () => set({ currentCandidate: null }),

            // Search candidates (client-side filtering for cached results)
            searchCandidates: (searchTerm) => {
                const { candidates } = get();
                if (!searchTerm) return candidates;

                const term = searchTerm.toLowerCase();
                return candidates.filter(candidate =>
                    candidate.email.toLowerCase().includes(term) ||
                    candidate.firstName.toLowerCase().includes(term) ||
                    candidate.lastName.toLowerCase().includes(term) ||
                    `${candidate.firstName} ${candidate.lastName}`.toLowerCase().includes(term)
                );
            },

            // Filter candidates by email domain
            filterCandidatesByEmailDomain: (domain) => {
                const { candidates } = get();
                if (!domain || domain === 'ALL') return candidates;
                return candidates.filter(candidate =>
                    candidate.email.toLowerCase().includes(`@${domain.toLowerCase()}`)
                );
            },

            // Filter candidates by application count
            filterCandidatesByApplicationCount: (minCount) => {
                const { candidates } = get();
                if (!minCount || minCount === 'ALL') return candidates;
                const min = parseInt(minCount);
                return candidates.filter(candidate => candidate.totalApplications >= min);
            },

            // Filter candidates by phone availability
            filterCandidatesByPhoneAvailability: (hasPhone) => {
                const { candidates } = get();
                if (hasPhone === 'ALL') return candidates;
                if (hasPhone === 'true') {
                    return candidates.filter(candidate => candidate.phoneNumber);
                }
                return candidates.filter(candidate => !candidate.phoneNumber);
            },

            // Get unique email domains from current candidates
            getUniqueEmailDomains: () => {
                const { candidates } = get();
                const domains = candidates
                    .map(candidate => {
                        const emailParts = candidate.email.split('@');
                        return emailParts.length > 1 ? emailParts[1] : null;
                    })
                    .filter(domain => domain)
                    .filter((domain, index, arr) => arr.indexOf(domain) === index);

                return domains.sort();
            },

            // Get unique companies from applications
            getUniqueCompanies: () => {
                const { cachedCompanies } = get();
                return Array.from(cachedCompanies).sort();
            },

            // Get unique job titles from applications
            getUniqueJobTitles: () => {
                const { cachedJobTitles } = get();
                return Array.from(cachedJobTitles).sort();
            },

            // Get application status distribution
            getApplicationStatusDistribution: () => {
                const { candidates } = get();
                const statusCounts = {};

                candidates.forEach(candidate => {
                    if (candidate.applications) {
                        candidate.applications.forEach(app => {
                            statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
                        });
                    }
                });

                return statusCounts;
            },

            // Get candidates by application count distribution
            getCandidateApplicationDistribution: () => {
                const { candidates } = get();
                const distribution = {};

                candidates.forEach(candidate => {
                    const count = candidate.totalApplications || 0;
                    let range;

                    if (count === 0) range = '0 applications';
                    else if (count === 1) range = '1 application';
                    else if (count <= 3) range = '2-3 applications';
                    else if (count <= 5) range = '4-5 applications';
                    else range = '6+ applications';

                    distribution[range] = (distribution[range] || 0) + 1;
                });

                return distribution;
            },

            // Pagination helpers
            resetPagination: () => set({
                currentPage: 0,
                totalPages: 0
            }),

            setPageSize: (size) => set({ pageSize: size }),

            goToPage: (page) => {
                const { activeFilters, pageSize, sortBy, sortDirection } = get();
                return get().fetchCandidates(activeFilters, page, pageSize, sortBy, sortDirection);
            },

            // Sorting helpers
            setSorting: (sortBy, sortDirection) => {
                const { activeFilters, currentPage, pageSize } = get();
                return get().fetchCandidates(activeFilters, currentPage, pageSize, sortBy, sortDirection);
            },

            // Cache management
            clearCache: () => set({
                cachedApplications: new Map(),
                cachedCompanies: new Set(),
                cachedJobTitles: new Set(),
                lastFetchTime: null
            }),

            // Check if cache is stale (5 minutes)
            isCacheStale: () => {
                const { lastFetchTime } = get();
                return !lastFetchTime || (Date.now() - lastFetchTime) > 300000; // 5 minutes
            },

            // Get candidate by email (utility function)
            getCandidateByEmail: (email) => {
                const { candidates } = get();
                return candidates.find(candidate =>
                    candidate.email.toLowerCase() === email.toLowerCase()
                );
            },

            // Get candidates with most applications
            getTopCandidatesByApplications: (limit = 5) => {
                const { candidates } = get();
                return [...candidates]
                    .sort((a, b) => (b.totalApplications || 0) - (a.totalApplications || 0))
                    .slice(0, limit);
            },

            // Get recently registered candidates
            getRecentCandidates: (limit = 5) => {
                const { candidates } = get();
                return [...candidates]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, limit);
            },

            // Statistics helpers
            getBasicStatistics: () => {
                const { candidates, statistics } = get();

                if (statistics) {
                    return statistics;
                }

                // Calculate from current candidates if statistics not loaded
                const totalCandidates = candidates.length;
                const candidatesWithApplications = candidates.filter(c => c.totalApplications > 0).length;
                const totalApplications = candidates.reduce((sum, c) => sum + (c.totalApplications || 0), 0);
                const averageApplicationsPerCandidate = totalCandidates > 0 ? totalApplications / totalCandidates : 0;

                return {
                    totalCandidates,
                    candidatesWithApplications,
                    candidatesWithoutApplications: totalCandidates - candidatesWithApplications,
                    averageApplicationsPerCandidate: Math.round(averageApplicationsPerCandidate * 100) / 100
                };
            },

            // Export candidates data (utility function for reports)
            exportCandidatesData: () => {
                const { candidates } = get();
                return candidates.map(candidate => ({
                    id: candidate.id,
                    email: candidate.email,
                    fullName: `${candidate.firstName} ${candidate.lastName}`,
                    phoneNumber: candidate.phoneNumber || 'N/A',
                    totalApplications: candidate.totalApplications || 0,
                    registeredAt: candidate.createdAt,
                    applications: candidate.applications?.map(app => ({
                        jobTitle: app.jobTitle,
                        company: app.companyName,
                        status: app.status,
                        appliedAt: app.appliedAt
                    })) || []
                }));
            }
        })),
        {
            name: 'candidate-store',
            partialize: (state) => ({
                pageSize: state.pageSize,
                sortBy: state.sortBy,
                sortDirection: state.sortDirection
            })
        }
    )
);

export default useCandidateStore;