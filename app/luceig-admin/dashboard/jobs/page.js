"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Eye, X, CheckCircle, AlertCircle, Briefcase, MapPin, Building, Search, Filter, ChevronLeft, ChevronRight, Power, PowerOff } from 'lucide-react';
import useJobStore from '@/stores/jobStore';
import useCompanyStore from '@/stores/companyStore';

const JobsPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [viewingJob, setViewingJob] = useState(null);
    const [deletingJob, setDeletingJob] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        location: '',
        experience: '',
        duration: '',
        salary: '',
        benefits: '',
        companyId: '',
        employmentType: '',
        status: 'ACTIVE'
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [filters, setFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');

    // Store state and actions
    const {
        jobs,
        isLoading,
        error,
        totalJobs,
        totalPages,
        currentPage,
        pageSize,
        fetchJobs,
        createJob,
        updateJob,
        deleteJob,
        toggleJobStatus,
        clearError,
        getUniqueCompanies,
        getUniqueLocations,
        getUniqueEmploymentTypes,
        getJobStatusCounts,
        setPageSize,
        resetPagination
    } = useJobStore();

    // Fetch companies for dropdown
    const { companies, fetchCompanies } = useCompanyStore();

    // Employment types from your enum
    const EMPLOYMENT_TYPES = [
        { value: 'FULL_TIME', label: 'Full Time' },
        { value: 'PART_TIME', label: 'Part Time' },
        { value: 'CONTRACT', label: 'Contract' },
        { value: 'INTERNSHIP', label: 'Internship' }
    ];

    // Job statuses
    const JOB_STATUSES = [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'CLOSED', label: 'Closed' }
    ];

    // Memoized fetch function to prevent unnecessary re-renders
    const fetchJobsData = useCallback(() => {
        fetchJobs(filters, currentPage, pageSize, sortBy, sortDirection);
    }, [fetchJobs, filters, currentPage, pageSize, sortBy, sortDirection]);

    // Fetch jobs and companies on component mount
    useEffect(() => {
        fetchJobsData();
        fetchCompanies({}, 0, 100); // Fetch companies for dropdown
    }, [fetchJobsData, fetchCompanies]);

    // Show message and auto-hide after 3 seconds
    const showMessage = useCallback((type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, []);

    // Handle search with debouncing
    const handleSearch = useCallback(() => {
        const searchFilters = { ...filters };
        if (searchTerm.trim()) {
            searchFilters.search = searchTerm.trim();
        } else {
            delete searchFilters.search;
        }
        setFilters(searchFilters);
        resetPagination(); // Reset to first page when searching
        fetchJobs(searchFilters, 0, pageSize, sortBy, sortDirection);
    }, [searchTerm, filters, pageSize, sortBy, sortDirection, fetchJobs, resetPagination]);

    // Handle filter change
    const handleFilterChange = useCallback((key, value) => {
        const newFilters = { ...filters };
        if (value && value !== 'ALL') {
            newFilters[key] = value;
        } else {
            delete newFilters[key];
        }
        setFilters(newFilters);
        resetPagination(); // Reset to first page when filtering
        fetchJobs(newFilters, 0, pageSize, sortBy, sortDirection);
    }, [filters, pageSize, sortBy, sortDirection, fetchJobs, resetPagination]);

    // Handle sorting
    const handleSort = useCallback((field) => {
        const newDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortDirection(newDirection);
        fetchJobs(filters, currentPage, pageSize, field, newDirection);
    }, [sortBy, sortDirection, filters, currentPage, pageSize, fetchJobs]);

    // Handle pagination
    const handlePageChange = useCallback((page) => {
        fetchJobs(filters, page, pageSize, sortBy, sortDirection);
    }, [filters, pageSize, sortBy, sortDirection, fetchJobs]);

    // Handle page size change
    const handlePageSizeChange = useCallback((newSize) => {
        setPageSize(newSize);
        resetPagination();
        fetchJobs(filters, 0, newSize, sortBy, sortDirection);
    }, [filters, sortBy, sortDirection, fetchJobs, setPageSize, resetPagination]);

    // Handle add job
    const handleAddJob = async (e) => {
        e.preventDefault();
        clearError();

        const result = await createJob(formData);

        if (result.success) {
            resetFormData();
            setShowAddModal(false);
            showMessage('success', 'Job created successfully!');
            fetchJobsData(); // Refresh the list
        } else {
            showMessage('error', result.error);
        }
    };

    // Handle edit job
    const handleEditJob = async (e) => {
        e.preventDefault();
        clearError();

        const result = await updateJob(editingJob.id, formData);

        if (result.success) {
            resetFormData();
            setShowEditModal(false);
            setEditingJob(null);
            showMessage('success', 'Job updated successfully!');
            fetchJobsData(); // Refresh the list
        } else {
            showMessage('error', result.error);
        }
    };

    // Handle delete job
    const handleDeleteJob = async () => {
        clearError();

        const result = await deleteJob(deletingJob.id);

        if (result.success) {
            setShowDeleteModal(false);
            setDeletingJob(null);
            showMessage('success', 'Job deleted successfully!');

            // If we're on the last page and it becomes empty, go to previous page
            if (jobs.length === 1 && currentPage > 0) {
                handlePageChange(currentPage - 1);
            } else {
                fetchJobsData();
            }
        } else {
            showMessage('error', result.error);
        }
    };

    // Handle toggle status
    const handleToggleStatus = async (jobId) => {
        clearError();

        const result = await toggleJobStatus(jobId);

        if (result.success) {
            showMessage('success', 'Job status updated successfully!');
            // Status is automatically updated in the store
        } else {
            showMessage('error', result.error);
        }
    };

    // Reset form data
    const resetFormData = () => {
        setFormData({
            title: '',
            description: '',
            requirements: '',
            location: '',
            experience: '',
            duration: '',
            salary: '',
            benefits: '',
            companyId: '',
            employmentType: '',
            status: 'ACTIVE'
        });
    };

    // Open view modal
    const openViewModal = (job) => {
        setViewingJob(job);
        setShowViewModal(true);
    };

    // Open edit modal
    const openEditModal = (job) => {
        setEditingJob(job);
        setFormData({
            title: job.title,
            description: job.description,
            requirements: job.requirements || '',
            location: job.location || '',
            experience: job.experience || '',
            duration: job.duration || '',
            salary: job.salary || '',
            benefits: job.benefits || '',
            companyId: job.companyId.toString(),
            employmentType: job.employmentType || '',
            status: job.status || 'ACTIVE'
        });
        setShowEditModal(true);
        clearError();
    };

    // Open add modal
    const openAddModal = () => {
        resetFormData();
        setShowAddModal(true);
        clearError();
    };

    // Open delete modal
    const openDeleteModal = (job) => {
        setDeletingJob(job);
        setShowDeleteModal(true);
    };

    // Close modals
    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setShowDeleteModal(false);
        setEditingJob(null);
        setViewingJob(null);
        setDeletingJob(null);
        resetFormData();
        clearError();
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status color
    const getStatusColor = (status) => {
        return status === 'ACTIVE'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    // Get employment type label
    const getEmploymentTypeLabel = (value) => {
        const type = EMPLOYMENT_TYPES.find(t => t.value === value);
        return type ? type.label : value;
    };

    // Get unique values for filters using store methods
    const uniqueCompanies = getUniqueCompanies();
    const uniqueLocations = getUniqueLocations();
    const uniqueEmploymentTypes = getUniqueEmploymentTypes();
    const statusCounts = getJobStatusCounts();

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({});
        setSearchTerm('');
        resetPagination();
        fetchJobs({}, 0, pageSize, sortBy, sortDirection);
    };

    // Check if any filters are active
    const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm.trim();

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
                    <p className="text-gray-600">Manage job postings and opportunities</p>
                    <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">
                            Total: {totalJobs} jobs
                        </span>
                        {statusCounts.ACTIVE && (
                            <span className="text-sm text-green-600">
                                Active: {statusCounts.ACTIVE}
                            </span>
                        )}
                        {statusCounts.CLOSED && (
                            <span className="text-sm text-red-600">
                                Closed: {statusCounts.CLOSED}
                            </span>
                        )}
                    </div>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center space-x-2 bg-mainColor text-white px-4 py-2 rounded-lg hover:bg-greenColor transition-colors duration-200"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Job</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search jobs by title, description, location, or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                            showFilters
                                ? 'bg-mainColor text-white border-mainColor'
                                : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <Filter className="h-5 w-5" />
                        <span>Filters</span>
                        {hasActiveFilters && (
                            <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                {Object.keys(filters).length + (searchTerm.trim() ? 1 : 0)}
                            </span>
                        )}
                    </button>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-mainColor text-white rounded-lg hover:bg-greenColor transition-colors"
                    >
                        Search
                    </button>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                <select
                                    value={filters.companyId || ''}
                                    onChange={(e) => handleFilterChange('companyId', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                >
                                    <option value="">All Companies</option>
                                    {uniqueCompanies.map((company) => (
                                        <option key={company.id} value={company.id}>{company.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                >
                                    <option value="">All Status</option>
                                    {JOB_STATUSES.map((status) => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                                <select
                                    value={filters.employmentType || ''}
                                    onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                >
                                    <option value="">All Types</option>
                                    {EMPLOYMENT_TYPES.map((type) => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <select
                                    value={filters.location || ''}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                >
                                    <option value="">All Locations</option>
                                    {uniqueLocations.map((location) => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Success/Error Message */}
            {message.text && (
                <div className={`flex items-center p-4 rounded-lg ${
                    message.type === 'success'
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                    {message.type === 'success' ? (
                        <CheckCircle className="h-5 w-5 mr-2" />
                    ) : (
                        <AlertCircle className="h-5 w-5 mr-2" />
                    )}
                    {message.text}
                </div>
            )}

            {/* Jobs Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Table Controls */}
                <div className="px-8 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">
                            Showing {jobs.length} of {totalJobs} jobs
                        </span>
                        <select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-mainColor"
                        >
                            <option value={10}>10 per page</option>
                            <option value={25}>25 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Sort by:</span>
                        <select
                            value={`${sortBy}-${sortDirection}`}
                            onChange={(e) => {
                                const [field, direction] = e.target.value.split('-');
                                setSortBy(field);
                                setSortDirection(direction);
                                fetchJobs(filters, currentPage, pageSize, field, direction);
                            }}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-mainColor"
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="title-asc">Title A-Z</option>
                            <option value="title-desc">Title Z-A</option>
                            <option value="status-asc">Status A-Z</option>
                            <option value="status-desc">Status Z-A</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide w-20">
                                ID
                            </th>
                            <th
                                className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('title')}
                            >
                                Job Title
                                {sortBy === 'title' && (
                                    <span className="ml-2">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Company
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Location
                            </th>
                            <th
                                className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('status')}
                            >
                                Status
                                {sortBy === 'status' && (
                                    <span className="ml-2">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th
                                className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('createdAt')}
                            >
                                Created At
                                {sortBy === 'createdAt' && (
                                    <span className="ml-2">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide w-64">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="px-8 py-16 text-center text-gray-500">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-mainColor"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : jobs.length > 0 ? (
                            jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900 font-medium">
                                        {job.id}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-mainColor flex items-center justify-center mr-3">
                                                <Briefcase className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-base font-semibold text-gray-900">
                                                    {job.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {getEmploymentTypeLabel(job.employmentType) || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        <div className="flex items-center">
                                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                                            {job.companyName || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                            {job.location || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        {formatDate(job.createdAt)}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openViewModal(job)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                                                title="View job details"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(job)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-mainColor/10 text-mainColor hover:bg-mainColor hover:text-white transition-all duration-200"
                                                title="Edit job"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(job.id)}
                                                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                                                    job.status === 'ACTIVE'
                                                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                                                }`}
                                                title={job.status === 'ACTIVE' ? 'Deactivate job' : 'Activate job'}
                                            >
                                                {job.status === 'ACTIVE' ? (
                                                    <PowerOff className="h-5 w-5" />
                                                ) : (
                                                    <Power className="h-5 w-5" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(job)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                                                title="Delete job"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-8 py-16 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <Briefcase className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-lg font-medium text-gray-900 mb-2">No jobs found</p>
                                        <p className="text-gray-500">
                                            {hasActiveFilters
                                                ? 'Try adjusting your filters or search terms'
                                                : 'Create your first job posting to get started!'
                                            }
                                        </p>
                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearAllFilters}
                                                className="mt-4 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-greenColor transition-colors"
                                            >
                                                Clear Filters
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-8 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalJobs)} of {totalJobs} jobs
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index)}
                                    className={`px-3 py-2 border rounded-lg ${
                                        currentPage === index
                                            ? 'bg-mainColor text-white border-mainColor'
                                            : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Job Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Job</h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddJob} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        placeholder="Enter job title"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company *
                                    </label>
                                    <select
                                        value={formData.companyId}
                                        onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="">Select a company</option>
                                        {companies.map((company) => (
                                            <option key={company.id} value={company.id}>{company.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description * (Min 50 char)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter job description"
                                    rows={4}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Requirements
                                </label>
                                <textarea
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter job requirements"
                                    rows={3}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        placeholder="Enter location"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Experience
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        placeholder="Enter experience level"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        placeholder="Enter duration"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Salary
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        placeholder="Enter salary range"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Benefits
                                </label>
                                <textarea
                                    value={formData.benefits}
                                    onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter benefits"
                                    rows={2}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Employment Type
                                    </label>
                                    <select
                                        value={formData.employmentType}
                                        onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        disabled={isLoading}
                                    >
                                        <option value="">Select employment type</option>
                                        {EMPLOYMENT_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        disabled={isLoading}
                                    >
                                        {JOB_STATUSES.map((status) => (
                                            <option key={status.value} value={status.value}>{status.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-greenColor transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Adding...' : 'Add Job'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Job Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Job</h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEditJob} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Job Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        placeholder="Enter job title"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Company *
                                    </label>
                                    <select
                                        value={formData.companyId}
                                        onChange={(e) => setFormData({...formData, companyId: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        required
                                        disabled={isLoading}
                                    >
                                        <option value="">Select a company</option>
                                        {companies.map((company) => (
                                            <option key={company.id} value={company.id}>{company.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter job description"
                                    rows={4}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Requirements
                                </label>
                                <textarea
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter job requirements"
                                    rows={3}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        placeholder="Enter location"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Experience
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        placeholder="Enter experience level"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        placeholder="Enter duration"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Salary
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        placeholder="Enter salary range"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Benefits
                                </label>
                                <textarea
                                    value={formData.benefits}
                                    onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter benefits"
                                    rows={2}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Employment Type
                                    </label>
                                    <select
                                        value={formData.employmentType}
                                        onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        disabled={isLoading}
                                    >
                                        <option value="">Select employment type</option>
                                        {EMPLOYMENT_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                        disabled={isLoading}
                                    >
                                        {JOB_STATUSES.map((status) => (
                                            <option key={status.value} value={status.value}>{status.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-greenColor transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Updating...' : 'Update Job'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Job Modal */}
            {showViewModal && viewingJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Job Icon */}
                            <div className="flex justify-center">
                                <div className="h-20 w-20 rounded-full bg-mainColor flex items-center justify-center">
                                    <Briefcase className="h-10 w-10 text-white" />
                                </div>
                            </div>

                            {/* Job Info */}
                            <div className="space-y-4">
                                <div className="text-center">
                                    <h4 className="text-xl font-bold text-gray-900">{viewingJob.title}</h4>
                                    <p className="text-gray-600">{viewingJob.companyName}</p>
                                    <div className="mt-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingJob.status)}`}>
                                            {viewingJob.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Job ID</label>
                                        <p className="text-base text-gray-900">{viewingJob.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Employment Type</label>
                                        <p className="text-base text-gray-900">{getEmploymentTypeLabel(viewingJob.employmentType) || 'Not specified'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Location</label>
                                        <p className="text-base text-gray-900">{viewingJob.location || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Experience</label>
                                        <p className="text-base text-gray-900">{viewingJob.experience || 'Not specified'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Duration</label>
                                        <p className="text-base text-gray-900">{viewingJob.duration || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Salary</label>
                                        <p className="text-base text-gray-900">{viewingJob.salary || 'Not specified'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Description</label>
                                    <p className="text-base text-gray-900 whitespace-pre-wrap">{viewingJob.description}</p>
                                </div>

                                {viewingJob.requirements && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Requirements</label>
                                        <p className="text-base text-gray-900 whitespace-pre-wrap">{viewingJob.requirements}</p>
                                    </div>
                                )}

                                {viewingJob.benefits && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Benefits</label>
                                        <p className="text-base text-gray-900 whitespace-pre-wrap">{viewingJob.benefits}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Created At</label>
                                        <p className="text-base text-gray-900">{formatDate(viewingJob.createdAt)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Applications</label>
                                        <p className="text-base text-gray-900">{viewingJob.applicationCount || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={closeModals}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deletingJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Delete Job</h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertCircle className="h-8 w-8 text-red-600" />
                                </div>
                            </div>

                            <div className="text-center">
                                <h4 className="text-lg font-medium text-gray-900 mb-2">Are you sure?</h4>
                                <p className="text-gray-600">
                                    You are about to delete "<strong>{deletingJob.title}</strong>". This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteJob}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Deleting...' : 'Delete Job'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobsPage;