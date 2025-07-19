"use client"
import React, { useEffect, useState } from 'react';
import useJobStore from '@/stores/jobStore'; // Adjust path as needed
import JobApplicationModal from './JobApplicationModal'; // Import the application modal

const JobOpportunitiesGrid = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Application modal state
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [selectedJobForApplication, setSelectedJobForApplication] = useState(null);

    // Get active jobs and related functions from store
    const {
        activeJobs,
        isLoading,
        error,
        fetchActiveJobs,
        clearError
    } = useJobStore();

    useEffect(() => {
        // Fetch active jobs when component mounts
        fetchActiveJobs();

        // Animation timer
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, [fetchActiveJobs]);

    const handleApply = (job) => {
        // Open application modal with selected job
        setSelectedJobForApplication(job);
        setShowApplicationModal(true);

        // Close job details modal if it's open
        if (isModalOpen) {
            setIsModalOpen(false);
            setSelectedJob(null);
        }
    };

    const handleReadMore = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
    };

    const closeApplicationModal = () => {
        setShowApplicationModal(false);
        setSelectedJobForApplication(null);
    };

    const formatSalary = (salary) => {
        if (!salary) return null;
        // Handle both string and number formats
        const numSalary = typeof salary === 'string' ? parseFloat(salary.replace(/[^0-9.-]+/g, '')) : salary;
        if (isNaN(numSalary)) return salary;
        return `$${numSalary.toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (error) {
        return (
            <div className="bg-[#E5E5E5] py-16 font-satoshi">
                <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">
                    <div className="text-center">
                        <p className="text-red-600 mb-4">Error loading jobs: {error}</p>
                        <button
                            onClick={() => {
                                clearError();
                                fetchActiveJobs();
                            }}
                            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-[#E5E5E5] py-16 font-satoshi">
                <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            <p className="text-gray-600 mt-4">Loading active job opportunities...</p>
                        </div>
                    )}

                    {/* No Jobs State */}
                    {!isLoading && activeJobs.length === 0 && (
                        <div className="text-center">
                            <p className="text-gray-600 text-lg">No active job opportunities available at the moment.</p>
                            <p className="text-gray-500 text-sm mt-2">Please check back later for new openings.</p>
                        </div>
                    )}

                    {/* Jobs Grid */}
                    {!isLoading && activeJobs.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {activeJobs.map((job, index) => (
                                <div
                                    key={job.id}
                                    className={`bg-white rounded-lg border-2 border-gray-400 p-6 transition-all duration-700 ease-out hover:scale-105 hover:shadow-lg ${
                                        `delay-${(index % 4 + 1) * 300}`
                                    } ${
                                        isVisible
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-8'
                                    }`}
                                >
                                    {/* Job Details */}
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-black mb-2 line-clamp-1">
                                            {job.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3">
                                            {job.companyName} {job.location && `• ${job.location}`}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {job.employmentType && (
                                                <span className="inline-block bg-black text-white text-xs px-2 py-1 rounded-full">
                                                    {job.employmentType}
                                                </span>
                                            )}
                                            {job.experience && (
                                                <span className="inline-block bg-gray-200 text-black text-xs px-2 py-1 rounded-full">
                                                    {job.experience} exp
                                                </span>
                                            )}
                                            {job.duration && (
                                                <span className="inline-block bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                                                    {job.duration}
                                                </span>
                                            )}
                                        </div>

                                        {/* Salary */}
                                        {job.salary && (
                                            <p className="text-black font-semibold text-sm mb-3">
                                                {formatSalary(job.salary)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col text-xs text-gray-500">
                                            <span>Posted: {formatDate(job.createdAt)}</span>
                                            {job.applicationCount !== undefined && (
                                                <span>{job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReadMore(job)}
                                                className="text-black font-medium text-sm hover:text-gray-700 transition-colors duration-200 underline"
                                            >
                                                Details
                                            </button>
                                            <button
                                                onClick={() => handleApply(job)}
                                                className="bg-black text-white font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Job Details Modal */}
            {isModalOpen && selectedJob && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-black">{selectedJob.title}</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-light"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="px-6 py-4">
                            {/* Company Info */}
                            <div className="mb-6">
                                <div className="flex items-center mb-4">
                                    <div className="mr-4">
                                        <h3 className="font-semibold text-lg">{selectedJob.companyName}</h3>
                                        <p className="text-gray-600">{selectedJob.location}</p>
                                    </div>
                                </div>

                                {/* Job Meta Info */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Employment Type</p>
                                        <p className="font-medium">{selectedJob.employmentType || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Experience Required</p>
                                        <p className="font-medium">{selectedJob.experience || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Duration</p>
                                        <p className="font-medium">{selectedJob.duration || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Salary</p>
                                        <p className="font-medium text-black">{formatSalary(selectedJob.salary) || 'Not disclosed'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description */}
                            {selectedJob.description && (
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-2">Job Description</h4>
                                    <p className="text-gray-700 whitespace-pre-line">{selectedJob.description}</p>
                                </div>
                            )}

                            {/* Requirements */}
                            {selectedJob.requirements && (
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-2">Requirements</h4>
                                    <p className="text-gray-700 whitespace-pre-line">{selectedJob.requirements}</p>
                                </div>
                            )}

                            {/* Benefits */}
                            {selectedJob.benefits && (
                                <div className="mb-6">
                                    <h4 className="font-semibold mb-2">Benefits</h4>
                                    <p className="text-gray-700 whitespace-pre-line">{selectedJob.benefits}</p>
                                </div>
                            )}

                            {/* Application Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Posted: {formatDate(selectedJob.createdAt)}</span>
                                    <span>Updated: {formatDate(selectedJob.updatedAt)}</span>
                                </div>
                                {selectedJob.applicationCount !== undefined && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        {selectedJob.applicationCount} applicant{selectedJob.applicationCount !== 1 ? 's' : ''} so far
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleApply(selectedJob)}
                                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Apply for this Position
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Job Application Modal */}
            <JobApplicationModal
                isOpen={showApplicationModal}
                onClose={closeApplicationModal}
                job={selectedJobForApplication}
            />
        </>
    );
};

export default JobOpportunitiesGrid;