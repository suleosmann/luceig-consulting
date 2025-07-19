"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, X, CheckCircle, AlertCircle, Building, MapPin, Briefcase, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import useCompanyStore from '@/stores/companyStore';

const CompaniesPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [viewingCompany, setViewingCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        industry: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [filters, setFilters] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const {
        companies,
        isLoading,
        error,
        totalCompanies,
        totalPages,
        currentPage,
        pageSize,
        fetchCompanies,
        createCompany,
        updateCompany,
        deleteCompany,
        clearError,
        getUniqueIndustries,
        getUniqueLocations
    } = useCompanyStore();

    // Fetch companies on component mount
    useEffect(() => {
        fetchCompanies(filters, 0, pageSize);
    }, [fetchCompanies, pageSize]);

    // Show message and auto-hide after 3 seconds
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    // Handle search
    const handleSearch = () => {
        const searchFilters = { ...filters };
        if (searchTerm.trim()) {
            searchFilters.search = searchTerm.trim();
        } else {
            delete searchFilters.search;
        }
        setFilters(searchFilters);
        fetchCompanies(searchFilters, 0, pageSize);
    };

    // Handle filter change
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters };
        if (value && value !== 'ALL') {
            newFilters[key] = value;
        } else {
            delete newFilters[key];
        }
        setFilters(newFilters);
        fetchCompanies(newFilters, 0, pageSize);
    };

    // Handle pagination
    const handlePageChange = (page) => {
        fetchCompanies(filters, page, pageSize);
    };

    // Handle add company
    const handleAddCompany = async (e) => {
        e.preventDefault();

        const result = await createCompany(formData);

        if (result.success) {
            setFormData({ name: '', location: '', industry: '' });
            setShowAddModal(false);
            showMessage('success', 'Company added successfully!');
            // Refresh the list
            fetchCompanies(filters, currentPage, pageSize);
        } else {
            showMessage('error', result.error);
        }
    };

    // Handle edit company
    const handleEditCompany = async (e) => {
        e.preventDefault();

        const result = await updateCompany(editingCompany.id, formData);

        if (result.success) {
            setFormData({ name: '', location: '', industry: '' });
            setShowEditModal(false);
            setEditingCompany(null);
            showMessage('success', 'Company updated successfully!');
            // Refresh the list
            fetchCompanies(filters, currentPage, pageSize);
        } else {
            showMessage('error', result.error);
        }
    };

    // Handle delete company
    const handleDeleteCompany = async (companyId) => {
        if (window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
            const result = await deleteCompany(companyId);

            if (result.success) {
                showMessage('success', 'Company deleted successfully!');
                // Refresh the list
                fetchCompanies(filters, currentPage, pageSize);
            } else {
                showMessage('error', result.error);
            }
        }
    };

    // Open view modal
    const openViewModal = (company) => {
        setViewingCompany(company);
        setShowViewModal(true);
    };

    // Open edit modal
    const openEditModal = (company) => {
        setEditingCompany(company);
        setFormData({
            name: company.name,
            location: company.location || '',
            industry: company.industry || ''
        });
        setShowEditModal(true);
        clearError();
    };

    // Open add modal
    const openAddModal = () => {
        setFormData({ name: '', location: '', industry: '' });
        setShowAddModal(true);
        clearError();
    };

    // Close modals
    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setEditingCompany(null);
        setViewingCompany(null);
        setFormData({ name: '', location: '', industry: '' });
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

    // Get unique values for filters
    const uniqueIndustries = getUniqueIndustries();
    const uniqueLocations = getUniqueLocations();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
                    <p className="text-gray-600">Manage companies and their information</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center space-x-2 bg-mainColor text-white px-4 py-2 rounded-lg hover:bg-greenColor transition-colors duration-200"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Company</span>
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
                                placeholder="Search companies by name, location, or industry..."
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
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Filter className="h-5 w-5" />
                        <span>Filters</span>
                    </button>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-mainColor text-white rounded-lg hover:bg-greenColor transition-colors"
                    >
                        Search
                    </button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                                <select
                                    value={filters.industry || ''}
                                    onChange={(e) => handleFilterChange('industry', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                >
                                    <option value="">All Industries</option>
                                    {uniqueIndustries.map((industry) => (
                                        <option key={industry} value={industry}>{industry}</option>
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

            {/* Companies Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide w-20">
                                ID
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Company Name
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Industry
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Location
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Created At
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide w-48">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-8 py-16 text-center text-gray-500">
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-mainColor"></div>
                                    </div>
                                </td>
                            </tr>
                        ) : companies.length > 0 ? (
                            companies.map((company) => (
                                <tr key={company.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900 font-medium">
                                        {company.id}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-mainColor flex items-center justify-center mr-3">
                                                <Building className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-base font-semibold text-gray-900">
                                                    {company.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        <div className="flex items-center">
                                            <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                                            {company.industry || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                            {company.location || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        {formatDate(company.createdAt)}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openViewModal(company)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                                                title="View company details"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(company)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-mainColor/10 text-mainColor hover:bg-mainColor hover:text-white transition-all duration-200"
                                                title="Edit company"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCompany(company.id)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200"
                                                title="Delete company"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-8 py-16 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <Building className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-lg font-medium text-gray-900 mb-2">No companies found</p>
                                        <p className="text-gray-500">Add your first company to get started!</p>
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
                            Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalCompanies)} of {totalCompanies} companies
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

            {/* Add Company Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Add New Company</h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddCompany} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Building className="inline h-4 w-4 mr-1" />
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter company name"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Briefcase className="inline h-4 w-4 mr-1" />
                                    Industry
                                </label>
                                <input
                                    type="text"
                                    value={formData.industry}
                                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter industry (e.g., Technology, Finance)"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="inline h-4 w-4 mr-1" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter location (e.g., New York, NY)"
                                    disabled={isLoading}
                                />
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
                                    {isLoading ? 'Adding...' : 'Add Company'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Company Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Company</h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEditCompany} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Building className="inline h-4 w-4 mr-1" />
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter company name"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Briefcase className="inline h-4 w-4 mr-1" />
                                    Industry
                                </label>
                                <input
                                    type="text"
                                    value={formData.industry}
                                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter industry"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <MapPin className="inline h-4 w-4 mr-1" />
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
                                    {isLoading ? 'Updating...' : 'Update Company'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Company Modal */}
            {showViewModal && viewingCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Company Details</h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Company Icon */}
                            <div className="flex justify-center">
                                <div className="h-20 w-20 rounded-full bg-mainColor flex items-center justify-center">
                                    <Building className="h-10 w-10 text-white" />
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Company ID</label>
                                        <p className="text-base text-gray-900">{viewingCompany.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Created At</label>
                                        <p className="text-base text-gray-900">{formatDate(viewingCompany.createdAt)}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Company Name</label>
                                    <p className="text-base text-gray-900 font-semibold">{viewingCompany.name}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Industry</label>
                                    <p className="text-base text-gray-900">{viewingCompany.industry || 'Not specified'}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Location</label>
                                    <p className="text-base text-gray-900">{viewingCompany.location || 'Not specified'}</p>
                                </div>

                                {viewingCompany.updatedAt && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                        <p className="text-base text-gray-900">{formatDate(viewingCompany.updatedAt)}</p>
                                    </div>
                                )}
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
        </div>
    );
};

export default CompaniesPage;