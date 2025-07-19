"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Eye, X, CheckCircle, AlertCircle, User, Mail, Phone, FileText, Briefcase, Building, Search, Filter, ChevronLeft, ChevronRight, Users, TrendingUp, Clock } from 'lucide-react';
import useCandidateStore from '@/stores/candidateStore';

const CandidatesPage = () => {
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewingCandidate, setViewingCandidate] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [filters, setFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('desc');

    // Store state and actions
    const {
        candidates,
        isLoading,
        error,
        totalCandidates,
        totalPages,
        currentPage,
        pageSize,
        statistics,
        fetchCandidates,
        fetchCandidateById,
        fetchCandidateStatistics,
        clearError,
        getUniqueEmailDomains,
        getUniqueCompanies,
        getUniqueJobTitles,
        getApplicationStatusDistribution,
        getCandidateApplicationDistribution,
        getBasicStatistics,
        setPageSize,
        resetPagination
    } = useCandidateStore();

    // Memoized fetch function to prevent unnecessary re-renders
    const fetchCandidatesData = useCallback(() => {
        fetchCandidates(filters, currentPage, pageSize, sortBy, sortDirection);
    }, [fetchCandidates, filters, currentPage, pageSize, sortBy, sortDirection]);

    // Fetch candidates and statistics on component mount
    useEffect(() => {
        fetchCandidatesData();
        fetchCandidateStatistics();
    }, [fetchCandidatesData, fetchCandidateStatistics]);

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
        fetchCandidates(searchFilters, 0, pageSize, sortBy, sortDirection);
    }, [searchTerm, filters, pageSize, sortBy, sortDirection, fetchCandidates, resetPagination]);

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
        fetchCandidates(newFilters, 0, pageSize, sortBy, sortDirection);
    }, [filters, pageSize, sortBy, sortDirection, fetchCandidates, resetPagination]);

    // Handle sorting
    const handleSort = useCallback((field) => {
        const newDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortBy(field);
        setSortDirection(newDirection);
        fetchCandidates(filters, currentPage, pageSize, field, newDirection);
    }, [sortBy, sortDirection, filters, currentPage, pageSize, fetchCandidates]);

    // Handle pagination
    const handlePageChange = useCallback((page) => {
        fetchCandidates(filters, page, pageSize, sortBy, sortDirection);
    }, [filters, pageSize, sortBy, sortDirection, fetchCandidates]);

    // Handle page size change
    const handlePageSizeChange = useCallback((newSize) => {
        setPageSize(newSize);
        resetPagination();
        fetchCandidates(filters, 0, newSize, sortBy, sortDirection);
    }, [filters, sortBy, sortDirection, fetchCandidates, setPageSize, resetPagination]);

    // Open view modal
    const openViewModal = async (candidate) => {
        clearError();

        // If we have full details, use them, otherwise fetch
        if (candidate.applications !== undefined) {
            setViewingCandidate(candidate);
            setShowViewModal(true);
        } else {
            const result = await fetchCandidateById(candidate.id);
            if (result.success) {
                setViewingCandidate(result.data);
                setShowViewModal(true);
            } else {
                showMessage('error', result.error);
            }
        }
    };

    // Close modals
    const closeModals = () => {
        setShowViewModal(false);
        setViewingCandidate(null);
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

    // Get status color for applications
    const getStatusColor = (status) => {
        const colors = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'REVIEWED': 'bg-blue-100 text-blue-800',
            'ACCEPTED': 'bg-green-100 text-green-800',
            'REJECTED': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    // Get unique values for filters
    const uniqueEmailDomains = getUniqueEmailDomains();
    const uniqueCompanies = getUniqueCompanies();
    const basicStats = getBasicStatistics();

    // Clear all filters
    const clearAllFilters = () => {
        setFilters({});
        setSearchTerm('');
        resetPagination();
        fetchCandidates({}, 0, pageSize, sortBy, sortDirection);
    };

    // Check if any filters are active
    const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm.trim();

    return (
        <div className="space-y-6">
            {/* Header with Stats */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
                    <p className="text-gray-600">View and manage candidate profiles and applications</p>
                    <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">
                            Total: {totalCandidates} candidates
                        </span>
                        <span className="text-sm text-blue-600">
                            With Applications: {basicStats.candidatesWithApplications}
                        </span>
                        <span className="text-sm text-gray-600">
                            Avg Applications: {basicStats.averageApplicationsPerCandidate}
                        </span>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                        <Users className="h-8 w-8 text-mainColor mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{basicStats.totalCandidates}</p>
                        <p className="text-xs text-gray-500">Total Candidates</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                        <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{basicStats.candidatesWithApplications}</p>
                        <p className="text-xs text-gray-500">Active Applicants</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
                        <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-gray-900">{basicStats.averageApplicationsPerCandidate}</p>
                        <p className="text-xs text-gray-500">Avg Applications</p>
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
                                placeholder="Search candidates by name or email..."
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Domain</label>
                                <select
                                    value={filters.emailDomain || ''}
                                    onChange={(e) => handleFilterChange('emailDomain', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                >
                                    <option value="">All Domains</option>
                                    {uniqueEmailDomains.map((domain) => (
                                        <option key={domain} value={domain}>{domain}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <select
                                    value={filters.hasPhone || ''}
                                    onChange={(e) => handleFilterChange('hasPhone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                >
                                    <option value="">All Candidates</option>
                                    <option value="true">With Phone</option>
                                    <option value="false">Without Phone</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Min Applications</label>
                                <select
                                    value={filters.minApplications || ''}
                                    onChange={(e) => handleFilterChange('minApplications', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                >
                                    <option value="">Any Number</option>
                                    <option value="1">1+ Applications</option>
                                    <option value="2">2+ Applications</option>
                                    <option value="3">3+ Applications</option>
                                    <option value="5">5+ Applications</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                <select
                                    value={filters.company || ''}
                                    onChange={(e) => handleFilterChange('company', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                >
                                    <option value="">All Companies</option>
                                    {uniqueCompanies.map((company) => (
                                        <option key={company} value={company}>{company}</option>
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

            {/* Candidates Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Table Controls */}
                <div className="px-8 py-4 border-b border-gray-200 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">
                            Showing {candidates.length} of {totalCandidates} candidates
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
                                fetchCandidates(filters, currentPage, pageSize, field, direction);
                            }}
                            className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-mainColor"
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="firstName-asc">Name A-Z</option>
                            <option value="firstName-desc">Name Z-A</option>
                            <option value="email-asc">Email A-Z</option>
                            <option value="email-desc">Email Z-A</option>
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
                                onClick={() => handleSort('firstName')}
                            >
                                Candidate
                                {sortBy === 'firstName' && (
                                    <span className="ml-2">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th
                                className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('email')}
                            >
                                Email
                                {sortBy === 'email' && (
                                    <span className="ml-2">
                                        {sortDirection === 'asc' ? '↑' : '↓'}
                                    </span>
                                )}
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Phone
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Applications
                            </th>
                            <th
                                className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                                onClick={() => handleSort('createdAt')}
                            >
                                Registered
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
                        ) : candidates.length > 0 ? (
                            candidates.map((candidate) => (
                                <tr key={candidate.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900 font-medium">
                                        {candidate.id}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-mainColor flex items-center justify-center mr-3">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-base font-semibold text-gray-900">
                                                    {candidate.firstName} {candidate.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Registered {formatDate(candidate.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        <div className="flex items-center">
                                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                            {candidate.email}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        <div className="flex items-center">
                                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                            {candidate.phoneNumber || 'Not provided'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-base font-medium text-gray-900">
                                                {candidate.totalApplications || 0}
                                            </span>
                                            <span className="text-sm text-gray-500 ml-1">
                                                application{(candidate.totalApplications || 0) !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        {formatDate(candidate.createdAt)}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openViewModal(candidate)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 border border-blue-200"
                                                title="View candidate details"
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
                                            <Users className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-lg font-medium text-gray-900 mb-2">No candidates found</p>
                                        <p className="text-gray-500">
                                            {hasActiveFilters
                                                ? 'Try adjusting your filters or search terms'
                                                : 'Candidates will appear here when they apply for jobs.'
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
                            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalCandidates)} of {totalCandidates} candidates
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

            {/* View Candidate Modal */}
            {showViewModal && viewingCandidate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Candidate Profile</h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Candidate Icon */}
                            <div className="flex justify-center">
                                <div className="h-20 w-20 rounded-full bg-mainColor flex items-center justify-center">
                                    <User className="h-10 w-10 text-white" />
                                </div>
                            </div>

                            {/* Candidate Info */}
                            <div className="text-center">
                                <h4 className="text-xl font-bold text-gray-900 mb-2">
                                    {viewingCandidate.firstName} {viewingCandidate.lastName}
                                </h4>
                                <p className="text-gray-600 mb-4">{viewingCandidate.email}</p>
                                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                                    <span>ID: {viewingCandidate.id}</span>
                                    <span>•</span>
                                    <span>Registered: {formatDate(viewingCandidate.createdAt)}</span>
                                    <span>•</span>
                                    <span>{viewingCandidate.totalApplications || 0} Applications</span>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h5 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Contact Information</h5>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Email Address</label>
                                            <p className="text-base text-gray-900 flex items-center">
                                                <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                                {viewingCandidate.email}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Phone Number</label>
                                            <p className="text-base text-gray-900 flex items-center">
                                                <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                {viewingCandidate.phoneNumber || 'Not provided'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Registration Date</label>
                                            <p className="text-base text-gray-900">{formatDate(viewingCandidate.createdAt)}</p>
                                        </div>

                                        {viewingCandidate.updatedAt !== viewingCandidate.createdAt && (
                                            <div>
                                                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                                <p className="text-base text-gray-900">{formatDate(viewingCandidate.updatedAt)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Application Summary */}
                                <div>
                                    <h5 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Application Summary</h5>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Total Applications</label>
                                            <p className="text-base text-gray-900">{viewingCandidate.totalApplications || 0}</p>
                                        </div>

                                        {viewingCandidate.applications && viewingCandidate.applications.length > 0 && (
                                            <>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Application Status Breakdown</label>
                                                    <div className="mt-2 space-y-1">
                                                        {(() => {
                                                            const statusCounts = viewingCandidate.applications.reduce((acc, app) => {
                                                                acc[app.status] = (acc[app.status] || 0) + 1;
                                                                return acc;
                                                            }, {});

                                                            return Object.entries(statusCounts).map(([status, count]) => (
                                                                <div key={status} className="flex justify-between items-center">
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                                                                        {status}
                                                                    </span>
                                                                    <span className="text-sm text-gray-600">{count}</span>
                                                                </div>
                                                            ));
                                                        })()}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-gray-500">Latest Application</label>
                                                    <p className="text-base text-gray-900">
                                                        {formatDate(Math.max(...viewingCandidate.applications.map(app => new Date(app.appliedAt))))}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Applications History */}
                            {viewingCandidate.applications && viewingCandidate.applications.length > 0 && (
                                <div>
                                    <h5 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Application History</h5>

                                    <div className="space-y-4">
                                        {viewingCandidate.applications
                                            .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
                                            .map((application) => (
                                                <div key={application.applicationId} className="bg-gray-50 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h6 className="font-semibold text-gray-900">{application.jobTitle}</h6>
                                                            <p className="text-sm text-gray-600 flex items-center">
                                                                <Building className="h-3 w-3 mr-1" />
                                                                {application.companyName}
                                                            </p>
                                                        </div>
                                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                                        {application.status}
                                                    </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                                        <div>
                                                            <span>Applied: {formatDate(application.appliedAt)}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            {application.cvFileName && (
                                                                <span className="flex items-center">
                                                                <FileText className="h-3 w-3 mr-1" />
                                                                CV: {application.cvFileName}
                                                            </span>
                                                            )}
                                                            {application.hasCoverLetter && (
                                                                <span className="text-blue-600">Cover Letter</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* No Applications */}
                            {(!viewingCandidate.applications || viewingCandidate.applications.length === 0) && (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Briefcase className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500">This candidate hasn't submitted any job applications yet.</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end pt-4 border-t">
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
        </div>
    );
};

export default CandidatesPage;