"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Eye, X, CheckCircle, AlertCircle, FileText, Mail, User, Building, Briefcase, MapPin, Search, Filter, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import useJobApplicationStore from '@/stores/jobApplicationStore';

const JobApplicationsPage = () => {
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingApplication, setViewingApplication] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [filters, setFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');

    // Store state and actions
    const {
        applications,
        isLoading,
        error,
        totalApplications,
        totalPages,
        currentPage,
        pageSize,
        fetchJobApplications,
        fetchJobApplicationById,
        clearError,
        getUniqueJobs,
        getUniqueCompanies,
        getUniqueCandidates,
        getApplicationStatusCounts,
        setPageSize,
        resetPagination
    } = useJobApplicationStore();

    // Application statuses
    const APPLICATION_STATUSES = [
        { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'REVIEWED', label: 'Reviewed', color: 'bg-blue-100 text-blue-800' },
        { value: 'ACCEPTED', label: 'Accepted', color: 'bg-green-100 text-green-800' },
        { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' }
    ];

    // Memoized fetch function to prevent unnecessary re-renders
    const fetchApplicationsData = useCallback(() => {
        fetchJobApplications(filters, currentPage, pageSize, sortBy, sortDirection);
    }, [fetchJobApplications, filters, currentPage, pageSize, sortBy, sortDirection]);

    // Fetch applications on component mount
    useEffect(() => {
        fetchApplicationsData();
    }, [fetchApplicationsData]);

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
        fetchJobApplications(searchFilters, 0, pageSize, sortBy, sortDirection);
    }, [searchTerm, filters, pageSize, sortBy, sortDirection, fetchJobApplications, resetPagination]);

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
        fetchJobApplications(newFilters, 0, pageSize, sortBy, sortDirection);
    }, [filters, pageSize, sortBy, sortDirection, fetchJobApplications, resetPagination]);

    // Handle sorting
    const handleSort = useCallback((field) => {
        const newDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortDirection(newDirection);
        fetchJobApplications(filters, currentPage, pageSize, field, newDirection);
    }, [sortBy, sortDirection, filters, currentPage, pageSize, fetchJobApplications]);

    // Handle pagination
    const handlePageChange = useCallback((page) => {
        fetchJobApplications(filters, page, pageSize, sortBy, sortDirection);
    }, [filters, pageSize, sortBy, sortDirection, fetchJobApplications]);

    // Handle page size change
    const handlePageSizeChange = useCallback((newSize) => {
        setPageSize(newSize);
        resetPagination();
        fetchJobApplications(filters, 0, newSize, sortBy, sortDirection);
    }, [filters, sortBy, sortDirection, fetchJobApplications, setPageSize, resetPagination]);

    // Open view modal
    const openViewModal = async (application) => {
        clearError();

        // If we have full details, use them, otherwise fetch
        if (application.coverLetter !== undefined) {
            setViewingApplication(application);
            setShowViewModal(true);
        } else {
            const result = await fetchJobApplicationById(application.id);
            if (result.success) {
                setViewingApplication(result.data);
                setShowViewModal(true);
            } else {
                showMessage('error', result.error);
            }
        }
    };

    // Close modals
    const closeModals = () => {
        setShowViewModal(false);
        setViewingApplication(null);
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
        const statusConfig = APPLICATION_STATUSES.find(s => s.value === status);
        return statusConfig ? statusConfig.color : 'bg-gray-100 text-gray-800';
    };

    // Get status label
    const getStatusLabel = (status) => {
        const statusConfig = APPLICATION_STATUSES.find(s => s.value === status);
        return statusConfig ? statusConfig.label : status;
    };

    // Get unique values for filters using store methods
    const uniqueJobs = getUniqueJobs();
    const uniqueCompanies = getUniqueCompanies();
    const uniqueCandidates = getUniqueCandidates();
    const statusCounts = getApplicationStatusCounts();

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({});
        setSearchTerm('');
        resetPagination();
        fetchJobApplications({}, 0, pageSize, sortBy, sortDirection);
    };

    // Check if any filters are active
    const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm.trim();

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
                    <p className="text-gray-600">View and manage job applications</p>
                    <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">
                            Total: {totalApplications} applications
                        </span>
                        {statusCounts.PENDING && (
                            <span className="text-sm text-yellow-600">
                                Pending: {statusCounts.PENDING}
                            </span>
                        )}
                        {statusCounts.REVIEWED && (
                            <span className="text-sm text-blue-600">
                                Reviewed: {statusCounts.REVIEWED}
                            </span>
                        )}
                        {statusCounts.ACCEPTED && (
                            <span className="text-sm text-green-600">
                                Accepted: {statusCounts.ACCEPTED}
                            </span>
                        )}
                        {statusCounts.REJECTED && (
                            <span className="text-sm text-red-600">
                                Rejected: {statusCounts.REJECTED}
                            </span>
                        )}
                    </div>
                </div>
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
                                placeholder="Search applications by job title, company, candidate name, or email..."
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job</label>
                                <select
                                    value={filters.jobId || ''}
                                    onChange={(e) => handleFilterChange('jobId', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                >
                                    <option value="">All Jobs</option>
                                    {uniqueJobs.map((job) => (
                                        <option key={job.id} value={job.id}>{job.title}</option>
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
                                    {APPLICATION_STATUSES.map((status) => (
                                        <option key={status.value} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                <select
                                    value={filters.companyName || ''}
                                    onChange={(e) => handleFilterChange('companyName', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                >
                                    <option value="">All Companies</option>
                                    {uniqueCompanies.map((company) => (
                                        <option key={company} value={company}>{company}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Candidate</label>
                                <select
                                    value={filters.candidateEmail || ''}
                                    onChange={(e) => handleFilterChange('candidateEmail', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                >
                                    <option value="">All Candidates</option>
                                    {uniqueCandidates.map((candidate) => (
                                        <option key={candidate.id} value={candidate.email}>
                                            {candidate.firstName} {candidate.lastName} ({candidate.email})
                                        </option>
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

            {/* Applications Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Table Controls */}
                <div className="px-8 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">
                            Showing {applications.length} of {totalApplications} applications
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
                                fetchJobApplications(filters, currentPage, pageSize, field, direction);
                            }}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-mainColor"
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="status-asc">Status A-Z</option>
                            <option value="status-desc">Status Z-A</option>
                            <option value="candidateFirstName-asc">Candidate A-Z</option>
                            <option value="candidateFirstName-desc">Candidate Z-A</option>
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
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Candidate
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Job Title
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Company
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
                                Applied At
                                {sortBy === 'createdAt' && (
                                    <span className="ml-2">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide w-32">
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
                        ) : applications.length > 0 ? (
                            applications.map((application) => (
                                <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900 font-medium">
                                        {application.id}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-mainColor flex items-center justify-center mr-3">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-base font-semibold text-gray-900">
                                                    {application.candidateFirstName} {application.candidateLastName}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <Mail className="h-3 w-3 mr-1" />
                                                    {application.candidateEmail}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        <div className="flex items-center">
                                            <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                                            {application.jobTitle}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        <div className="flex items-center">
                                            <Building className="h-4 w-4 text-gray-400 mr-2" />
                                            {application.companyName}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                                            {getStatusLabel(application.status)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        {formatDate(application.createdAt)}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openViewModal(application)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                                                title="View application details"
                                            >
                                                <Eye className="h-5 w-5" />
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
                                            <FileText className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-lg font-medium text-gray-900 mb-2">No applications found</p>
                                        <p className="text-gray-500">
                                            {hasActiveFilters
                                                ? 'Try adjusting your filters or search terms'
                                                : 'Applications will appear here as candidates apply for jobs.'
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
                            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalApplications)} of {totalApplications} applications
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

            {/* View Application Modal */}
            {showViewModal && viewingApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Application Icon */}
                            <div className="flex justify-center">
                                <div className="h-20 w-20 rounded-full bg-mainColor flex items-center justify-center">
                                    <FileText className="h-10 w-10 text-white" />
                                </div>
                            </div>

                            {/* Status and Basic Info */}
                            <div className="text-center">
                                <h4 className="text-xl font-bold text-gray-900 mb-2">
                                    Application #{viewingApplication.id}
                                </h4>
                                <div className="mb-4">
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-base font-medium ${getStatusColor(viewingApplication.status)}`}>
                                        {getStatusLabel(viewingApplication.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Two Column Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Candidate Information */}
                                <div className="space-y-4">
                                    <h5 className="text-lg font-semibold text-gray-900 border-b pb-2">Candidate Information</h5>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Full Name</label>
                                        <p className="text-base text-gray-900">
                                            {viewingApplication.candidateFirstName} {viewingApplication.candidateLastName}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Email Address</label>
                                        <p className="text-base text-gray-900">{viewingApplication.candidateEmail}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                        <p className="text-base text-gray-900">
                                            {viewingApplication.candidatePhoneNumber || 'Not provided'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">CV File</label>
                                        <div className="flex items-center space-x-2">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                            <span className="text-base text-gray-900">
                                                {viewingApplication.cvFileName || 'CV file available'}
                                            </span>
                                            {viewingApplication.cvFilePath && (
                                                <button
                                                    className="inline-flex items-center text-mainColor hover:text-greenColor"
                                                    title="Download CV"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Job Information */}
                                <div className="space-y-4">
                                    <h5 className="text-lg font-semibold text-gray-900 border-b pb-2">Job Information</h5>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Job Title</label>
                                        <p className="text-base text-gray-900">{viewingApplication.jobTitle}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Company</label>
                                        <p className="text-base text-gray-900">{viewingApplication.companyName}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Job ID</label>
                                        <p className="text-base text-gray-900">{viewingApplication.jobId}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Application Date</label>
                                        <p className="text-base text-gray-900">{formatDate(viewingApplication.createdAt)}</p>
                                    </div>

                                    {viewingApplication.updatedAt !== viewingApplication.createdAt && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                            <p className="text-base text-gray-900">{formatDate(viewingApplication.updatedAt)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cover Letter */}
                            {viewingApplication.coverLetter && (
                                <div className="space-y-2">
                                    <h5 className="text-lg font-semibold text-gray-900 border-b pb-2">Cover Letter</h5>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed">
                                            {viewingApplication.coverLetter}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    onClick={closeModals}
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                                {viewingApplication.cvFilePath && (
                                    <button
                                        className="px-6 py-2 bg-mainColor text-white rounded-lg hover:bg-greenColor transition-colors flex items-center space-x-2"
                                        title="Download CV"
                                    >
                                        <Download className="h-4 w-4" />
                                        <span>Download CV</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobApplicationsPage;