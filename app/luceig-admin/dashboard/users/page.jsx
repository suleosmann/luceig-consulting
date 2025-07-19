"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Eye, X, CheckCircle, AlertCircle, User, Mail, Phone, Users, Badge } from 'lucide-react';
import useUserStore from '@/stores/userStore';

const UsersPage = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const {
        users,
        isLoading,
        error,
        fetchUsers,
        createUser,
        updateUser,
        clearError
    } = useUserStore();

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Show message and auto-hide after 3 seconds
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    // Handle add user
    const handleAddUser = async (e) => {
        e.preventDefault();

        // Hardcode roles to [1] as requested
        const userData = {
            ...formData,
            roles: [1]
        };

        const result = await createUser(userData);

        if (result.success) {
            setFormData({ firstName: '', lastName: '', phoneNumber: '', email: '' });
            setShowAddModal(false);
            showMessage('success', 'User added successfully! They will receive an email to set up their password.');
        } else {
            showMessage('error', result.error);
        }
    };

    // Handle edit user
    const handleEditUser = async (e) => {
        e.preventDefault();

        // Hardcode roles to [1] as requested
        const userData = {
            ...formData,
            roles: [1]
        };

        const result = await updateUser(editingUser.id, userData);

        if (result.success) {
            setFormData({ firstName: '', lastName: '', phoneNumber: '', email: '' });
            setShowEditModal(false);
            setEditingUser(null);
            showMessage('success', 'User updated successfully!');
        } else {
            showMessage('error', result.error);
        }
    };

    // Open view modal
    const openViewModal = (user) => {
        setViewingUser(user);
        setShowViewModal(true);
    };

    // Open edit modal
    const openEditModal = (user) => {
        setEditingUser(user);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phone || '',
            email: user.email
        });
        setShowEditModal(true);
        clearError();
    };

    // Open add modal
    const openAddModal = () => {
        setFormData({ firstName: '', lastName: '', phoneNumber: '', email: '' });
        setShowAddModal(true);
        clearError();
    };

    // Close modals
    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setEditingUser(null);
        setViewingUser(null);
        setFormData({ firstName: '', lastName: '', phoneNumber: '', email: '' });
        clearError();
    };

    // Get status display
    const getStatusDisplay = (status) => {
        if (status === 1 || status === '1') return 'ACTIVE';
        if (status === 0 || status === '0') return 'INACTIVE';
        if (status === 'ACTIVE') return 'ACTIVE';
        if (status === 'INACTIVE') return 'INACTIVE';
        return 'PENDING';
    };

    // Get status color
    const getStatusColor = (status) => {
        const statusText = getStatusDisplay(status);
        if (statusText === 'ACTIVE') return 'bg-green-100 text-green-800';
        if (statusText === 'INACTIVE') return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600">Manage your users and their access</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center space-x-2 bg-mainColor text-white px-4 py-2 rounded-lg hover:bg-greenColor transition-colors duration-200"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add User</span>
                </button>
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

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide w-20">
                                ID
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Name
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Email
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Phone
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide w-32">
                                Status
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide w-40">
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
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900 font-medium">
                                        {user.id}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-mainColor flex items-center justify-center mr-3">
                                                    <span className="text-sm font-medium text-white">
                                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                    </span>
                                            </div>
                                            <div>
                                                <div className="text-base font-semibold text-gray-900">
                                                    {user.fullName || `${user.firstName} ${user.lastName}`}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="px-8 py-6 text-base text-gray-600">
                                        {user.phone || 'N/A'}
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.status)}`}>
                                                {getStatusDisplay(user.status)}
                                            </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => openViewModal(user)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200"
                                                title="View user details"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-mainColor/10 text-mainColor hover:bg-mainColor hover:text-white transition-all duration-200"
                                                title="Edit user"
                                            >
                                                <Edit className="h-5 w-5" />
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
                                            <Users className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-lg font-medium text-gray-900 mb-2">No users found</p>
                                        <p className="text-gray-500">Add your first user to get started!</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddUser} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="inline h-4 w-4 mr-1" />
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter first name"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="inline h-4 w-4 mr-1" />
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter last name"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="inline h-4 w-4 mr-1" />
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter email address"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="inline h-4 w-4 mr-1" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter phone number"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-blue-800 text-sm">
                                    <strong>Note:</strong> The user will automatically be assigned the Super Admin role and will receive an email to set up their password.
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
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-greenColor transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Adding...' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEditUser} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="inline h-4 w-4 mr-1" />
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter first name"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="inline h-4 w-4 mr-1" />
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter last name"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="inline h-4 w-4 mr-1" />
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter email address"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="inline h-4 w-4 mr-1" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainColor focus:border-transparent"
                                    placeholder="Enter phone number"
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
                                    {isLoading ? 'Updating...' : 'Update User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View User Modal */}
            {showViewModal && viewingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* User Avatar */}
                            <div className="flex justify-center">
                                <div className="h-20 w-20 rounded-full bg-mainColor flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">
                                        {viewingUser.firstName?.charAt(0)}{viewingUser.lastName?.charAt(0)}
                                    </span>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">User ID</label>
                                        <p className="text-base text-gray-900">{viewingUser.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Status</label>
                                        <div className="mt-1">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                viewingUser.status === 'ACTIVE'
                                                    ? 'bg-green-100 text-green-800'
                                                    : viewingUser.status === 'INACTIVE'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {viewingUser.status || 'PENDING'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                                    <p className="text-base text-gray-900">{viewingUser.fullName || `${viewingUser.firstName} ${viewingUser.lastName}`}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <p className="text-base text-gray-900">{viewingUser.email}</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-500">Phone</label>
                                    <p className="text-base text-gray-900">{viewingUser.phone || 'Not provided'}</p>
                                </div>

                                {viewingUser.createdAt && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Created At</label>
                                        <p className="text-base text-gray-900">{formatDate(viewingUser.createdAt)}</p>
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

export default UsersPage;