// stores/jobApplicationStore.js
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { apiClient } from '@/lib/apiClient';

const useJobApplicationStore = create(
    devtools(
        subscribeWithSelector((set, get) => ({
            // State
            applications: [],
            currentApplication: null,
            isLoading: false,
            isSubmitting: false,
            error: null,
            totalApplications: 0,
            totalPages: 0,
            currentPage: 0,
            pageSize: 10,

            // Cached data for performance
            cachedJobs: new Map(),
            cachedCandidates: new Map(),
            cachedCompanies: new Map(),
            lastFetchTime: null,

            // UI state
            sortBy: 'createdAt',
            sortDirection: 'desc',
            activeFilters: {},

            // Form state
            applicationForm: {
                jobId: null,
                email: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                coverLetter: '',
                cvFile: null
            },

            // Actions

            // Get all job applications with filtering and pagination
            fetchJobApplications: async (filters = {}, page = 0, size = 10, sortBy = 'createdAt', sortDirection = 'desc') => {
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

                    const response = await apiClient.get(`/job-application?${params}`);
                    const { data } = response.data;

                    // Update cached data
                    const jobsMap = new Map();
                    const candidatesMap = new Map();
                    const companiesMap = new Map();

                    data.content.forEach(application => {
                        if (application.jobId && application.jobTitle) {
                            jobsMap.set(application.jobId, {
                                id: application.jobId,
                                title: application.jobTitle,
                                companyName: application.companyName
                            });
                        }
                        if (application.candidateId && application.candidateEmail) {
                            candidatesMap.set(application.candidateId, {
                                id: application.candidateId,
                                email: application.candidateEmail,
                                firstName: application.candidateFirstName,
                                lastName: application.candidateLastName,
                                phoneNumber: application.candidatePhoneNumber
                            });
                        }
                        if (application.companyName) {
                            companiesMap.set(application.companyName, application.companyName);
                        }
                    });

                    set({
                        applications: data.content,
                        totalApplications: data.totalElements,
                        totalPages: data.totalPages,
                        currentPage: data.number,
                        pageSize: data.size,
                        isLoading: false,
                        error: null,
                        lastFetchTime: Date.now(),
                        cachedJobs: jobsMap,
                        cachedCandidates: candidatesMap,
                        cachedCompanies: companiesMap,
                        sortBy,
                        sortDirection,
                        activeFilters: filters
                    });

                    return { success: true, data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch job applications';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Get job application by ID with caching
            fetchJobApplicationById: async (applicationId, useCache = true) => {
                const currentState = get();

                // Check cache first
                if (useCache && currentState.currentApplication?.id === applicationId) {
                    return { success: true, data: currentState.currentApplication };
                }

                // Check if application exists in applications array
                const cachedApplication = currentState.applications.find(app => app.id === applicationId);
                if (useCache && cachedApplication) {
                    set({ currentApplication: cachedApplication });
                    return { success: true, data: cachedApplication };
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.get(`/job-application/${applicationId}`);
                    const { data } = response.data;

                    set({
                        currentApplication: data,
                        isLoading: false,
                        error: null
                    });

                    return { success: true, data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch job application';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Submit new job application
            submitJobApplication: async (applicationData) => {
                set({ isSubmitting: true, error: null });

                try {
                    // Create FormData for multipart upload
                    const formData = new FormData();
                    formData.append('jobId', applicationData.jobId.toString());
                    formData.append('email', applicationData.email);
                    formData.append('firstName', applicationData.firstName);
                    formData.append('lastName', applicationData.lastName);

                    if (applicationData.phoneNumber) {
                        formData.append('phoneNumber', applicationData.phoneNumber);
                    }
                    if (applicationData.coverLetter) {
                        formData.append('coverLetter', applicationData.coverLetter);
                    }
                    formData.append('cvFile', applicationData.cvFile);

                    const response = await apiClient.post('/job-application', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    const { data } = response.data;

                    // Optimistically update the state
                    set(state => ({
                        applications: [data, ...state.applications],
                        totalApplications: state.totalApplications + 1,
                        isSubmitting: false,
                        error: null,
                        // Clear form after successful submission
                        applicationForm: {
                            jobId: null,
                            email: '',
                            firstName: '',
                            lastName: '',
                            phoneNumber: '',
                            coverLetter: '',
                            cvFile: null
                        }
                    }));

                    // Refresh to get accurate pagination
                    setTimeout(() => get().refreshJobApplications(), 100);

                    return { success: true, data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to submit job application';
                    set({
                        isSubmitting: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Refresh current view
            refreshJobApplications: async () => {
                const { activeFilters, currentPage, pageSize, sortBy, sortDirection } = get();
                return get().fetchJobApplications(activeFilters, currentPage, pageSize, sortBy, sortDirection);
            },

            // Get applications by job ID
            fetchApplicationsByJob: async (jobId, useCache = true) => {
                const currentState = get();

                // Check if we can use cached data
                if (useCache && currentState.activeFilters.jobId === jobId.toString()) {
                    return { success: true, data: currentState.applications };
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.get(`/job-application?jobId=${jobId}`);
                    const { data } = response.data;

                    set({
                        applications: data.content || data,
                        totalApplications: data.totalElements || data.length,
                        totalPages: data.totalPages || 1,
                        currentPage: data.number || 0,
                        isLoading: false,
                        error: null,
                        activeFilters: { jobId: jobId.toString() }
                    });

                    return { success: true, data: data.content || data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch applications by job';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Get applications by candidate email
            fetchApplicationsByCandidate: async (candidateEmail, useCache = true) => {
                const currentState = get();

                // Check if we can use cached data
                if (useCache && currentState.activeFilters.candidateEmail === candidateEmail) {
                    return { success: true, data: currentState.applications };
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await apiClient.get(`/job-application?candidateEmail=${candidateEmail}`);
                    const { data } = response.data;

                    set({
                        applications: data.content || data,
                        totalApplications: data.totalElements || data.length,
                        totalPages: data.totalPages || 1,
                        currentPage: data.number || 0,
                        isLoading: false,
                        error: null,
                        activeFilters: { candidateEmail }
                    });

                    return { success: true, data: data.content || data };
                } catch (error) {
                    const errorMessage = error.response?.data?.message || 'Failed to fetch applications by candidate';
                    set({
                        isLoading: false,
                        error: errorMessage
                    });
                    return { success: false, error: errorMessage };
                }
            },

            // Form management
            updateApplicationForm: (field, value) => {
                set(state => ({
                    applicationForm: {
                        ...state.applicationForm,
                        [field]: value
                    }
                }));
            },

            resetApplicationForm: () => {
                set({
                    applicationForm: {
                        jobId: null,
                        email: '',
                        firstName: '',
                        lastName: '',
                        phoneNumber: '',
                        coverLetter: '',
                        cvFile: null
                    }
                });
            },

            setApplicationFormData: (formData) => {
                set({
                    applicationForm: { ...formData }
                });
            },

            // Utility functions

            // Clear error
            clearError: () => set({ error: null }),

            // Clear current application
            clearCurrentApplication: () => set({ currentApplication: null }),

            // Search applications (client-side filtering for cached results)
            searchApplications: (searchTerm) => {
                const { applications } = get();
                if (!searchTerm) return applications;

                const term = searchTerm.toLowerCase();
                return applications.filter(app =>
                    app.jobTitle.toLowerCase().includes(term) ||
                    app.companyName.toLowerCase().includes(term) ||
                    app.candidateEmail.toLowerCase().includes(term) ||
                    `${app.candidateFirstName} ${app.candidateLastName}`.toLowerCase().includes(term) ||
                    (app.coverLetter && app.coverLetter.toLowerCase().includes(term))
                );
            },

            // Filter applications by status
            filterApplicationsByStatus: (status) => {
                const { applications } = get();
                if (!status || status === 'ALL') return applications;
                return applications.filter(app => app.status === status);
            },

            // Filter applications by job
            filterApplicationsByJob: (jobId) => {
                const { applications } = get();
                if (!jobId || jobId === 'ALL') return applications;
                return applications.filter(app => app.jobId === jobId);
            },

            // Filter applications by company
            filterApplicationsByCompany: (companyName) => {
                const { applications } = get();
                if (!companyName || companyName === 'ALL') return applications;
                return applications.filter(app => app.companyName === companyName);
            },

            // Get unique jobs from current applications (optimized)
            getUniqueJobs: () => {
                const { applications, cachedJobs } = get();

                // Use cached data if available
                if (cachedJobs.size > 0) {
                    return Array.from(cachedJobs.values())
                        .sort((a, b) => a.title.localeCompare(b.title));
                }

                // Fallback to computing from applications
                const jobs = applications
                    .map(app => ({
                        id: app.jobId,
                        title: app.jobTitle,
                        companyName: app.companyName
                    }))
                    .filter(job => job.id && job.title)
                    .filter((job, index, arr) =>
                        arr.findIndex(j => j.id === job.id) === index
                    );

                return jobs.sort((a, b) => a.title.localeCompare(b.title));
            },

            // Get unique companies from current applications (optimized)
            getUniqueCompanies: () => {
                const { applications, cachedCompanies } = get();

                // Use cached data if available
                if (cachedCompanies.size > 0) {
                    return Array.from(cachedCompanies.values()).sort();
                }

                // Fallback to computing from applications
                const companies = applications
                    .map(app => app.companyName)
                    .filter(company => company)
                    .filter((company, index, arr) => arr.indexOf(company) === index);

                return companies.sort();
            },

            // Get unique candidates from current applications (optimized)
            getUniqueCandidates: () => {
                const { applications, cachedCandidates } = get();

                // Use cached data if available
                if (cachedCandidates.size > 0) {
                    return Array.from(cachedCandidates.values())
                        .sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
                }

                // Fallback to computing from applications
                const candidates = applications
                    .map(app => ({
                        id: app.candidateId,
                        email: app.candidateEmail,
                        firstName: app.candidateFirstName,
                        lastName: app.candidateLastName,
                        phoneNumber: app.candidatePhoneNumber
                    }))
                    .filter(candidate => candidate.id && candidate.email)
                    .filter((candidate, index, arr) =>
                        arr.findIndex(c => c.id === candidate.id) === index
                    );

                return candidates.sort((a, b) =>
                    `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
                );
            },

            // Get applications by status counts (optimized)
            getApplicationStatusCounts: () => {
                const { applications } = get();
                return applications.reduce((acc, app) => {
                    acc[app.status] = (acc[app.status] || 0) + 1;
                    return acc;
                }, {});
            },

            // Get applications by job counts
            getJobApplicationCounts: () => {
                const { applications } = get();
                return applications.reduce((acc, app) => {
                    if (app.jobTitle) {
                        acc[app.jobTitle] = (acc[app.jobTitle] || 0) + 1;
                    }
                    return acc;
                }, {});
            },

            // Get applications by company counts
            getCompanyApplicationCounts: () => {
                const { applications } = get();
                return applications.reduce((acc, app) => {
                    if (app.companyName) {
                        acc[app.companyName] = (acc[app.companyName] || 0) + 1;
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
                return get().fetchJobApplications(activeFilters, page, pageSize, sortBy, sortDirection);
            },

            // Sorting helpers
            setSorting: (sortBy, sortDirection) => {
                const { activeFilters, currentPage, pageSize } = get();
                return get().fetchJobApplications(activeFilters, currentPage, pageSize, sortBy, sortDirection);
            },

            // Cache management
            clearCache: () => set({
                cachedJobs: new Map(),
                cachedCandidates: new Map(),
                cachedCompanies: new Map(),
                lastFetchTime: null
            }),

            // Check if cache is stale (5 minutes)
            isCacheStale: () => {
                const { lastFetchTime } = get();
                return !lastFetchTime || (Date.now() - lastFetchTime) > 300000; // 5 minutes
            },

            // File upload validation
            validateCvFile: (file) => {
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                const maxSize = 5 * 1024 * 1024; // 5MB

                if (!file) {
                    return { valid: false, error: 'CV file is required' };
                }

                if (!allowedTypes.includes(file.type)) {
                    return { valid: false, error: 'CV file must be in PDF, DOC, or DOCX format' };
                }

                if (file.size > maxSize) {
                    return { valid: false, error: 'CV file size must not exceed 5MB' };
                }

                return { valid: true, error: null };
            },

            // Check if candidate has already applied for a job
            hasAppliedForJob: (jobId, candidateEmail) => {
                const { applications } = get();
                return applications.some(app =>
                    app.jobId === jobId && app.candidateEmail.toLowerCase() === candidateEmail.toLowerCase()
                );
            },

            // Statistics
            getStatistics: () => {
                const { applications } = get();
                const statusCounts = get().getApplicationStatusCounts();
                const jobCounts = get().getJobApplicationCounts();
                const companyCounts = get().getCompanyApplicationCounts();

                return {
                    total: applications.length,
                    pending: statusCounts.PENDING || 0,
                    reviewed: statusCounts.REVIEWED || 0,
                    accepted: statusCounts.ACCEPTED || 0,
                    rejected: statusCounts.REJECTED || 0,
                    uniqueJobs: Object.keys(jobCounts).length,
                    uniqueCompanies: Object.keys(companyCounts).length,
                    uniqueCandidates: get().getUniqueCandidates().length,
                    averageApplicationsPerJob: applications.length / Math.max(Object.keys(jobCounts).length, 1),
                    averageApplicationsPerCompany: applications.length / Math.max(Object.keys(companyCounts).length, 1),
                    jobCounts,
                    companyCounts
                };
            }
        })),
        {
            name: 'job-application-store',
            partialize: (state) => ({
                pageSize: state.pageSize,
                sortBy: state.sortBy,
                sortDirection: state.sortDirection,
                applicationForm: state.applicationForm
            })
        }
    )
);

export default useJobApplicationStore;