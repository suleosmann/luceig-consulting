// stores/jobStore.js
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { apiClient } from '@/lib/apiClient';

const useJobStore = create(
    devtools(
        subscribeWithSelector((set, get) => ({
            // State
            jobs: [],
            activeJobs: [], // New state for active jobs
            currentJob: null,
            isLoading: false,
            error: null,
            totalJobs: 0,
            totalPages: 0,
            currentPage: 0,
            pageSize: 10,

            // Cached data for performance
            cachedCompanies: new Map(),
            cachedLocations: new Set(),
            cachedEmploymentTypes: new Set(),
            lastFetchTime: null,

            // UI state
            sortBy: 'createdAt',
            sortDirection: 'desc',
            activeFilters: {},

            // Actions

            // Get all jobs with filtering and pagination
            fetchJobs: async (filters = {}, page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => {
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

                    const response = await apiClient.get(`/job?${params}`);
                    const { data } = response.data;

                    // Update cached data
                    const companiesMap = new Map();
                    const locationsSet = new Set();
                    const employmentTypesSet = new Set();

                    data.content.forEach(job => {
                        if (job.companyId && job.companyName) {
                            companiesMap.set(job.companyId, job.companyName);
                        }
                        if (job.location) {
                            locationsSet.add(job.location);
                        }
                        if (job.employmentType) {
                            employmentTypesSet.add(job.employmentType);
                        }
                    });

                    set({
                        jobs: data.content,
                        totalJobs: data.totalElements,
                        totalPages: data.totalPages,
                        currentPage: data.number,
                        pageSize: data.size,
                        isLoading: false,
                        error: null,
                        lastFetchTime: Date.now(),
                        cachedCompanies: companiesMap,
                        cachedLocations: locationsSet,
                        cachedEmploymentTypes: employmentTypesSet,
                        sortBy,
                        sortDirection,
                        activeFilters: filters
                    });

                    return { success: true, data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch jobs';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Get only active jobs with filtering and pagination (maps to getActiveJobs service method)
            fetchActiveJobs: async () => {
                const currentState = get();

                // Skip if same request is already loading
                if (currentState.isLoading) return { success: false, error: 'Already loading' };

                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.get('/job/active');
                    const { data } = response.data;

                    set({
                        activeJobs: data,
                        isLoading: false,
                        error: null,
                        lastFetchTime: Date.now()
                    });

                    return { success: true, data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch active jobs';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Get active jobs by company (maps to getActiveJobsByCompany service method)
            fetchActiveJobsByCompany: async (companyId, useCache = true) => {
                const currentState = get();

                // Check if we can use cached data
                if (useCache && currentState.activeFilters.companyId === companyId.toString()) {
                    return { success: true, data: currentState.activeJobs };
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.get(`/job/active/company/${companyId}`);
                    const { data } = response.data;

                    set({
                        activeJobs: data,
                        totalJobs: data.length,
                        totalPages: 1,
                        currentPage: 0,
                        isLoading: false,
                        error: null,
                        activeFilters: { companyId: companyId.toString() }
                    });

                    return { success: true, data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch active jobs by company';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Refresh current view
            refreshJobs: async () => {
                const { activeFilters, currentPage, pageSize, sortBy, sortDirection } = get();
                return get().fetchJobs(activeFilters, currentPage, pageSize, sortBy, sortDirection);
            },

            // Refresh active jobs view
            refreshActiveJobs: async () => {
                const { activeFilters, currentPage, pageSize, sortBy, sortDirection } = get();
                return get().fetchActiveJobs(activeFilters, currentPage, pageSize, sortBy, sortDirection);
            },

            // Get job by ID with caching
            fetchJobById: async (jobId, useCache = true) => {
                const currentState = get();

                // Check cache first
                if (useCache && currentState.currentJob?.id === jobId) {
                    return { success: true, data: currentState.currentJob };
                }

                // Check if job exists in jobs array or activeJobs array
                const cachedJob = currentState.jobs.find(job => job.id === jobId) ||
                    currentState.activeJobs.find(job => job.id === jobId);
                if (useCache && cachedJob) {
                    set({ currentJob: cachedJob });
                    return { success: true, data: cachedJob };
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.get(`/job/${jobId}`);
                    const { data } = response.data;

                    set({
                        currentJob: data,
                        isLoading: false,
                        error: null
                    });

                    return { success: true, data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch job';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Create new job with optimistic updates
            createJob: async (jobData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.post('/job', jobData);
                    const { data } = response.data;

                    // Optimistically update the state
                    set(state => ({
                        jobs: [data, ...state.jobs],
                        // Add to activeJobs if the new job is active
                        activeJobs: data.status === 'ACTIVE' ? [data, ...state.activeJobs] : state.activeJobs,
                        totalJobs: state.totalJobs + 1,
                        isLoading: false,
                        error: null
                    }));

                    // Refresh to get accurate pagination
                    setTimeout(() => get().refreshJobs(), 100);

                    return { success: true, data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to create job';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Update job with optimistic updates
            updateJob: async (jobId, jobData) => {
                const currentState = get();
                const originalJob = currentState.jobs.find(job => job.id === jobId);

                if (!originalJob) {
                    return { success: false, error: 'Job not found' };
                }

                // Optimistically update the UI
                set(state => ({
                    jobs: state.jobs.map(job =>
                        job.id === jobId ? { ...job, ...jobData } : job
                    ),
                    activeJobs: state.activeJobs.map(job =>
                        job.id === jobId ? { ...job, ...jobData } : job
                    ),
                    currentJob: state.currentJob?.id === jobId ?
                        { ...state.currentJob, ...jobData } : state.currentJob,
                    isLoading: true,
                    error: null
                }));

                try {
                    const response = await apiClient.put(`/job/${jobId}`, jobData);
                    const { data } = response.data;

                    // Update with server response
                    set(state => ({
                        jobs: state.jobs.map(job =>
                            job.id === jobId ? { ...job, ...data } : job
                        ),
                        activeJobs: state.activeJobs.map(job =>
                            job.id === jobId ? { ...job, ...data } : job
                        ),
                        currentJob: state.currentJob?.id === jobId ?
                            { ...state.currentJob, ...data } : state.currentJob,
                        isLoading: false,
                        error: null
                    }));

                    return { success: true, data };
                } catch (error) {
                    // Rollback optimistic update
                    set(state => ({
                        jobs: state.jobs.map(job =>
                            job.id === jobId ? originalJob : job
                        ),
                        activeJobs: state.activeJobs.map(job =>
                            job.id === jobId ? originalJob : job
                        ),
                        currentJob: state.currentJob?.id === jobId ? originalJob : state.currentJob,
                        isLoading: false,
                        error: error.response?.data?.message || 'Failed to update job'
                    }));
                    return { success: false, error: error.response?.data?.message || 'Failed to update job' };
                }
            },

            // Delete job with optimistic updates
            deleteJob: async (jobId) => {
                const currentState = get();
                const jobToDelete = currentState.jobs.find(job => job.id === jobId);

                if (!jobToDelete) {
                    return { success: false, error: 'Job not found' };
                }

                // Optimistically remove from UI
                set(state => ({
                    jobs: state.jobs.filter(job => job.id !== jobId),
                    activeJobs: state.activeJobs.filter(job => job.id !== jobId),
                    totalJobs: state.totalJobs - 1,
                    currentJob: state.currentJob?.id === jobId ? null : state.currentJob,
                    isLoading: true,
                    error: null
                }));

                try {
                    await apiClient.delete(`/job/${jobId}`);

                    set({ isLoading: false });
                    return { success: true };
                } catch (error) {
                    // Rollback optimistic update
                    set(state => ({
                        jobs: [...state.jobs, jobToDelete].sort((a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        ),
                        activeJobs: jobToDelete.status === 'ACTIVE'
                            ? [...state.activeJobs, jobToDelete].sort((a, b) =>
                                new Date(b.createdAt) - new Date(a.createdAt))
                            : state.activeJobs,
                        totalJobs: state.totalJobs + 1,
                        isLoading: false,
                        error: error.response?.data?.message || 'Failed to delete job'
                    }));
                    return { success: false, error: error.response?.data?.message || 'Failed to delete job' };
                }
            },

            // Get jobs by company
            fetchJobsByCompany: async (companyId, useCache = true) => {
                const currentState = get();

                // Check if we can use cached data
                if (useCache && currentState.activeFilters.companyId === companyId.toString()) {
                    return { success: true, data: currentState.jobs };
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.get(`/job/company/${companyId}`);
                    const { data } = response.data;

                    set({
                        jobs: data,
                        totalJobs: data.length,
                        totalPages: 1,
                        currentPage: 0,
                        isLoading: false,
                        error: null,
                        activeFilters: { companyId: companyId.toString() }
                    });

                    return { success: true, data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch jobs by company';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Toggle job status with optimistic updates
            toggleJobStatus: async (jobId) => {
                const currentState = get();
                const jobToToggle = currentState.jobs.find(job => job.id === jobId) ||
                    currentState.activeJobs.find(job => job.id === jobId);

                if (!jobToToggle) {
                    return { success: false, error: 'Job not found' };
                }

                const newStatus = jobToToggle.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE';

                // Optimistically update the UI
                set(state => ({
                    jobs: state.jobs.map(job =>
                        job.id === jobId ? { ...job, status: newStatus } : job
                    ),
                    activeJobs: newStatus === 'ACTIVE'
                        ? state.activeJobs.find(job => job.id === jobId)
                            ? state.activeJobs.map(job =>
                                job.id === jobId ? { ...job, status: newStatus } : job
                            )
                            : [...state.activeJobs, { ...jobToToggle, status: newStatus }]
                        : state.activeJobs.filter(job => job.id !== jobId),
                    currentJob: state.currentJob?.id === jobId ?
                        { ...state.currentJob, status: newStatus } : state.currentJob,
                    isLoading: true,
                    error: null
                }));

                try {
                    const response = await apiClient.patch(`/job/${jobId}/toggle-status`);
                    const { data } = response.data;

                    // Update with server response
                    set(state => ({
                        jobs: state.jobs.map(job =>
                            job.id === jobId ? { ...job, status: data.status } : job
                        ),
                        activeJobs: data.status === 'ACTIVE'
                            ? state.activeJobs.find(job => job.id === jobId)
                                ? state.activeJobs.map(job =>
                                    job.id === jobId ? { ...job, status: data.status } : job
                                )
                                : [...state.activeJobs, data]
                            : state.activeJobs.filter(job => job.id !== jobId),
                        currentJob: state.currentJob?.id === jobId ?
                            { ...state.currentJob, status: data.status } : state.currentJob,
                        isLoading: false,
                        error: null
                    }));

                    return { success: true, data };
                } catch (error) {
                    // Rollback optimistic update
                    set(state => ({
                        jobs: state.jobs.map(job =>
                            job.id === jobId ? { ...job, status: jobToToggle.status } : job
                        ),
                        activeJobs: jobToToggle.status === 'ACTIVE'
                            ? state.activeJobs.find(job => job.id === jobId)
                                ? state.activeJobs.map(job =>
                                    job.id === jobId ? { ...job, status: jobToToggle.status } : job
                                )
                                : [...state.activeJobs, jobToToggle]
                            : state.activeJobs.filter(job => job.id !== jobId),
                        currentJob: state.currentJob?.id === jobId ?
                            { ...state.currentJob, status: jobToToggle.status } : state.currentJob,
                        isLoading: false,
                        error: error.response?.data?.message || 'Failed to toggle job status'
                    }));
                    return { success: false, error: error.response?.data?.message || 'Failed to toggle job status' };
                }
            },

            // Bulk operations
            bulkDeleteJobs: async (jobIds) => {
                const currentState = get();
                const jobsToDelete = currentState.jobs.filter(job => jobIds.includes(job.id));

                // Optimistically remove from UI
                set(state => ({
                    jobs: state.jobs.filter(job => !jobIds.includes(job.id)),
                    activeJobs: state.activeJobs.filter(job => !jobIds.includes(job.id)),
                    totalJobs: state.totalJobs - jobIds.length,
                    isLoading: true,
                    error: null
                }));

                try {
                    await Promise.all(jobIds.map(id => apiClient.delete(`/job/${id}`)));

                    set({ isLoading: false });
                    return { success: true };
                } catch (error) {
                    // Rollback optimistic update
                    set(state => ({
                        jobs: [...state.jobs, ...jobsToDelete].sort((a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        ),
                        activeJobs: [...state.activeJobs, ...jobsToDelete.filter(job => job.status === 'ACTIVE')]
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                        totalJobs: state.totalJobs + jobIds.length,
                        isLoading: false,
                        error: 'Failed to delete some jobs'
                    }));
                    return { success: false, error: 'Failed to delete some jobs' };
                }
            },

            bulkUpdateJobStatus: async (jobIds, status) => {
                const currentState = get();
                const originalJobs = currentState.jobs.filter(job => jobIds.includes(job.id));

                // Optimistically update the UI
                set(state => ({
                    jobs: state.jobs.map(job =>
                        jobIds.includes(job.id) ? { ...job, status } : job
                    ),
                    activeJobs: status === 'ACTIVE'
                        ? state.activeJobs.map(job =>
                            jobIds.includes(job.id) ? { ...job, status } : job
                        ).concat(originalJobs.filter(job =>
                            !state.activeJobs.find(aj => aj.id === job.id)).map(job => ({ ...job, status })))
                        : state.activeJobs.filter(job => !jobIds.includes(job.id)),
                    isLoading: true,
                    error: null
                }));

                try {
                    await Promise.all(jobIds.map(id =>
                        apiClient.patch(`/job/${id}/status`, { status })
                    ));

                    set({ isLoading: false });
                    return { success: true };
                } catch (error) {
                    // Rollback optimistic update
                    set(state => ({
                        jobs: state.jobs.map(job => {
                            const originalJob = originalJobs.find(orig => orig.id === job.id);
                            return originalJob ? { ...job, status: originalJob.status } : job;
                        }),
                        activeJobs: state.activeJobs.map(job => {
                            const originalJob = originalJobs.find(orig => orig.id === job.id);
                            return originalJob ? { ...job, status: originalJob.status } : job;
                        }).filter(job => job.status === 'ACTIVE'),
                        isLoading: false,
                        error: 'Failed to update some jobs'
                    }));
                    return { success: false, error: 'Failed to update some jobs' };
                }
            },

            // Utility functions

            // Clear error
            clearError: () => set({ error: null }),

            // Clear current job
            clearCurrentJob: () => set({ currentJob: null }),

            // Clear active jobs
            clearActiveJobs: () => set({ activeJobs: [] }),

            // Search jobs (client-side filtering for cached results)
            searchJobs: (searchTerm) => {
                const { jobs } = get();
                if (!searchTerm) return jobs;

                const term = searchTerm.toLowerCase();
                return jobs.filter(job =>
                    job.title.toLowerCase().includes(term) ||
                    job.description.toLowerCase().includes(term) ||
                    (job.location && job.location.toLowerCase().includes(term)) ||
                    (job.companyName && job.companyName.toLowerCase().includes(term)) ||
                    (job.requirements && job.requirements.toLowerCase().includes(term))
                );
            },

            // Search active jobs (client-side filtering)
            searchActiveJobs: (searchTerm) => {
                const { activeJobs } = get();
                if (!searchTerm) return activeJobs;

                const term = searchTerm.toLowerCase();
                return activeJobs.filter(job =>
                    job.title.toLowerCase().includes(term) ||
                    job.description.toLowerCase().includes(term) ||
                    (job.location && job.location.toLowerCase().includes(term)) ||
                    (job.companyName && job.companyName.toLowerCase().includes(term)) ||
                    (job.requirements && job.requirements.toLowerCase().includes(term))
                );
            },

            // Filter jobs by status
            filterJobsByStatus: (status) => {
                const { jobs } = get();
                if (!status || status === 'ALL') return jobs;
                return jobs.filter(job => job.status === status);
            },

            // Filter jobs by employment type
            filterJobsByEmploymentType: (employmentType) => {
                const { jobs } = get();
                if (!employmentType || employmentType === 'ALL') return jobs;
                return jobs.filter(job => job.employmentType === employmentType);
            },

            // Filter active jobs by employment type
            filterActiveJobsByEmploymentType: (employmentType) => {
                const { activeJobs } = get();
                if (!employmentType || employmentType === 'ALL') return activeJobs;
                return activeJobs.filter(job => job.employmentType === employmentType);
            },

            // Filter jobs by company
            filterJobsByCompany: (companyId) => {
                const { jobs } = get();
                if (!companyId || companyId === 'ALL') return jobs;
                return jobs.filter(job => job.companyId === companyId);
            },

            // Filter active jobs by company
            filterActiveJobsByCompany: (companyId) => {
                const { activeJobs } = get();
                if (!companyId || companyId === 'ALL') return activeJobs;
                return activeJobs.filter(job => job.companyId === companyId);
            },

            // Get unique companies from current jobs (optimized)
            getUniqueCompanies: () => {
                const { jobs, cachedCompanies } = get();

                // Use cached data if available
                if (cachedCompanies.size > 0) {
                    return Array.from(cachedCompanies.entries())
                        .map(([id, name]) => ({ id, name }))
                        .sort((a, b) => a.name.localeCompare(b.name));
                }

                // Fallback to computing from jobs
                const companies = jobs
                    .map(job => ({ id: job.companyId, name: job.companyName }))
                    .filter(company => company.id && company.name)
                    .filter((company, index, arr) =>
                        arr.findIndex(c => c.id === company.id) === index
                    );

                return companies.sort((a, b) => a.name.localeCompare(b.name));
            },

            // Get unique locations from current jobs (optimized)
            getUniqueLocations: () => {
                const { jobs, cachedLocations } = get();

                // Use cached data if available
                if (cachedLocations.size > 0) {
                    return Array.from(cachedLocations).sort();
                }

                // Fallback to computing from jobs
                const locations = jobs
                    .map(job => job.location)
                    .filter(location => location)
                    .filter((location, index, arr) => arr.indexOf(location) === index);

                return locations.sort();
            },

            // Get unique employment types from current jobs (optimized)
            getUniqueEmploymentTypes: () => {
                const { jobs, cachedEmploymentTypes } = get();

                // Use cached data if available
                if (cachedEmploymentTypes.size > 0) {
                    return Array.from(cachedEmploymentTypes).sort();
                }

                // Fallback to computing from jobs
                const types = jobs
                    .map(job => job.employmentType)
                    .filter(type => type)
                    .filter((type, index, arr) => arr.indexOf(type) === index);

                return types.sort();
            },

            // Get jobs by status counts (optimized)
            getJobStatusCounts: () => {
                const { jobs } = get();
                return jobs.reduce((acc, job) => {
                    acc[job.status] = (acc[job.status] || 0) + 1;
                    return acc;
                }, {});
            },

            // Get jobs by employment type counts
            getEmploymentTypeCounts: () => {
                const { jobs } = get();
                return jobs.reduce((acc, job) => {
                    if (job.employmentType) {
                        acc[job.employmentType] = (acc[job.employmentType] || 0) + 1;
                    }
                    return acc;
                }, {});
            },

            // Get jobs by company counts
            getCompanyCounts: () => {
                const { jobs } = get();
                return jobs.reduce((acc, job) => {
                    if (job.companyName) {
                        acc[job.companyName] = (acc[job.companyName] || 0) + 1;
                    }
                    return acc;
                }, {});
            },

            // Pagination helpers
            resetPagination: () => set({
                currentPage: 0,
                totalPages: 0
            }),

            setPageSize: (size) => set({ pageSize: size }),

            goToPage: (page) => {
                const { activeFilters, pageSize, sortBy, sortDirection } = get();
                return get().fetchJobs(activeFilters, page, pageSize, sortBy, sortDirection);
            },

            goToActiveJobsPage: (page) => {
                const { activeFilters, pageSize, sortBy, sortDirection } = get();
                return get().fetchActiveJobs(activeFilters, page, pageSize, sortBy, sortDirection);
            },

            // Sorting helpers
            setSorting: (sortBy, sortDirection) => {
                const { activeFilters, currentPage, pageSize } = get();
                return get().fetchJobs(activeFilters, currentPage, pageSize, sortBy, sortDirection);
            },

            setActiveJobsSorting: (sortBy, sortDirection) => {
                const { activeFilters, currentPage, pageSize } = get();
                return get().fetchActiveJobs(activeFilters, currentPage, pageSize, sortBy, sortDirection);
            },

            // Cache management
            clearCache: () => set({
                cachedCompanies: new Map(),
                cachedLocations: new Set(),
                cachedEmploymentTypes: new Set(),
                lastFetchTime: null
            }),

            // Check if cache is stale (5 minutes)
            isCacheStale: () => {
                const { lastFetchTime } = get();
                return !lastFetchTime || (Date.now() - lastFetchTime) > 300000; // 5 minutes
            },

            // Statistics
            getStatistics: () => {
                const { jobs } = get();
                const statusCounts = get().getJobStatusCounts();
                const employmentTypeCounts = get().getEmploymentTypeCounts();
                const companyCounts = get().getCompanyCounts();

                return {
                    total: jobs.length,
                    active: statusCounts.ACTIVE || 0,
                    closed: statusCounts.CLOSED || 0,
                    companies: Object.keys(companyCounts).length,
                    locations: get().getUniqueLocations().length,
                    employmentTypes: employmentTypeCounts,
                    companyCounts,
                    averageJobsPerCompany: jobs.length / Math.max(Object.keys(companyCounts).length, 1)
                };
            }
        })),
        {
            name: 'job-store',
            partialize: (state) => ({
                pageSize: state.pageSize,
                sortBy: state.sortBy,
                sortDirection: state.sortDirection
            })
        }
    )
);

export default useJobStore;