"use client";
import React, { useState, useCallback, useRef } from 'react';
import { X, Upload, FileText, CheckCircle, AlertCircle, User, Mail, Phone, MessageSquare, Briefcase, Building, MapPin } from 'lucide-react';
import useJobApplicationStore from '@/stores/jobApplicationStore';

const JobApplicationModal = ({ isOpen, onClose, job }) => {
    const [dragActive, setDragActive] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        coverLetter: '',
        cvFile: null
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [applicationSuccess, setApplicationSuccess] = useState(false);

    const fileInputRef = useRef(null);

    // Store state and actions
    const {
        isSubmitting,
        error,
        submitJobApplication,
        clearError,
        validateCvFile,
        hasAppliedForJob
    } = useJobApplicationStore();

    // Check if user has already applied
    const alreadyApplied = job ? hasAppliedForJob(job.id, formData.email) : false;

    // Handle form field changes
    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear validation error for this field
        if (validationErrors[field]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }

        // Clear store error
        if (error) clearError();
    }, [validationErrors, error, clearError]);

    // Validate form
    const validateForm = useCallback(() => {
        const errors = {};

        // Email validation
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Name validation
        if (!formData.firstName || formData.firstName.trim().length < 2) {
            errors.firstName = 'First name must be at least 2 characters';
        }
        if (!formData.lastName || formData.lastName.trim().length < 2) {
            errors.lastName = 'Last name must be at least 2 characters';
        }

        // Phone validation (optional but if provided should be valid)
        if (formData.phoneNumber && formData.phoneNumber.length > 15) {
            errors.phoneNumber = 'Phone number is too long';
        }

        // Cover letter validation (optional but if provided should not be too long)
        if (formData.coverLetter && formData.coverLetter.length > 2000) {
            errors.coverLetter = 'Cover letter must not exceed 2000 characters';
        }

        // CV file validation
        if (!formData.cvFile) {
            errors.cvFile = 'CV file is required';
        } else {
            const fileValidation = validateCvFile(formData.cvFile);
            if (!fileValidation.valid) {
                errors.cvFile = fileValidation.error;
            }
        }

        return errors;
    }, [formData, validateCvFile]);

    // Handle file selection
    const handleFileSelect = useCallback((file) => {
        if (file) {
            const validation = validateCvFile(file);
            if (validation.valid) {
                setFormData(prev => ({ ...prev, cvFile: file }));
                // Clear any existing CV file error
                if (validationErrors.cvFile) {
                    setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.cvFile;
                        return newErrors;
                    });
                }
            } else {
                setValidationErrors(prev => ({ ...prev, cvFile: validation.error }));
            }
        }
    }, [validateCvFile, validationErrors]);

    // Handle drag events
    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    // Handle file drop
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, [handleFileSelect]);

    // Handle file input change
    const handleFileInputChange = useCallback((e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    }, [handleFileSelect]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!job) return;

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        // Check for duplicate application
        if (hasAppliedForJob(job.id, formData.email)) {
            setValidationErrors({ email: 'You have already applied for this job with this email address' });
            return;
        }

        // Submit application
        const applicationData = {
            jobId: job.id,
            email: formData.email.trim(),
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            phoneNumber: formData.phoneNumber.trim() || null,
            coverLetter: formData.coverLetter.trim() || null,
            cvFile: formData.cvFile
        };

        const result = await submitJobApplication(applicationData);

        if (result.success) {
            setApplicationSuccess(true);
            // Reset form
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                coverLetter: '',
                cvFile: null
            });
            setValidationErrors({});

            // Auto-close after 2 seconds
            setTimeout(() => {
                setApplicationSuccess(false);
                onClose();
            }, 2000);
        }
    };

    // Reset form when modal closes
    const handleClose = useCallback(() => {
        if (!isSubmitting) {
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                coverLetter: '',
                cvFile: null
            });
            setValidationErrors({});
            setApplicationSuccess(false);
            clearError();
            onClose();
        }
    }, [isSubmitting, onClose, clearError]);

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (!isOpen || !job) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col">
                {/* Success State */}
                {applicationSuccess && (
                    <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10">
                        <div className="text-center">
                            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-10 w-10 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Submitted!</h3>
                            <p className="text-gray-600">Your application has been sent successfully. We'll be in touch soon.</p>
                        </div>
                    </div>
                )}

                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 mb-1">Apply for Position</h2>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Briefcase className="h-4 w-4" />
                                <span className="font-medium">{job.title}</span>
                                <span>•</span>
                                <Building className="h-4 w-4" />
                                <span>{job.companyName}</span>
                                {job.location && (
                                    <>
                                        <span>•</span>
                                        <MapPin className="h-4 w-4" />
                                        <span>{job.location}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                            validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your first name"
                                        disabled={isSubmitting}
                                    />
                                    {validationErrors.firstName && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                            validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter your last name"
                                        disabled={isSubmitting}
                                    />
                                    {validationErrors.lastName && (
                                        <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="inline h-4 w-4 mr-1" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                        validationErrors.email ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your email address"
                                    disabled={isSubmitting}
                                />
                                {validationErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                                )}
                                {alreadyApplied && formData.email && (
                                    <p className="mt-1 text-sm text-yellow-600">
                                        Note: You have already applied for this job with this email.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="inline h-4 w-4 mr-1" />
                                    Phone Number (Optional)
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
                                        validationErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your phone number"
                                    disabled={isSubmitting}
                                />
                                {validationErrors.phoneNumber && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.phoneNumber}</p>
                                )}
                            </div>
                        </div>

                        {/* CV Upload */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                Resume/CV *
                            </h3>

                            <div
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                    dragActive
                                        ? 'border-black bg-gray-50'
                                        : validationErrors.cvFile
                                            ? 'border-red-300 bg-red-50'
                                            : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileInputChange}
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    disabled={isSubmitting}
                                />

                                {formData.cvFile ? (
                                    <div className="space-y-3">
                                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                            <FileText className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{formData.cvFile.name}</p>
                                            <p className="text-xs text-gray-500">{formatFileSize(formData.cvFile.size)}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-sm text-black hover:text-gray-700 font-medium underline"
                                            disabled={isSubmitting}
                                        >
                                            Choose Different File
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                                            <Upload className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Drag and drop your CV here, or{' '}
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="text-black hover:text-gray-700 font-medium underline"
                                                    disabled={isSubmitting}
                                                >
                                                    browse files
                                                </button>
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Supports PDF, DOC, DOCX (max 5MB)
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {validationErrors.cvFile && (
                                <p className="text-sm text-red-600">{validationErrors.cvFile}</p>
                            )}
                        </div>

                        {/* Cover Letter */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <MessageSquare className="h-5 w-5 mr-2" />
                                Cover Letter (Optional)
                            </h3>

                            <div>
                                <textarea
                                    value={formData.coverLetter}
                                    onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                                    rows={4}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none ${
                                        validationErrors.coverLetter ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Tell us why you're the perfect fit for this role..."
                                    disabled={isSubmitting}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    {validationErrors.coverLetter ? (
                                        <p className="text-sm text-red-600">{validationErrors.coverLetter}</p>
                                    ) : (
                                        <div />
                                    )}
                                    <p className="text-xs text-gray-500">
                                        {formData.coverLetter.length}/2000 characters
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || Object.keys(validateForm()).length > 0}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <span>Submit Application</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobApplicationModal;