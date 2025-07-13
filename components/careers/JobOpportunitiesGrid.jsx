"use client"
import React, { useEffect, useState } from 'react';

const JobOpportunitiesGrid = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const jobCards = [
        {
            id: 1,
            title: "Job Title | Company Name",
            delay: "delay-300"
        },
        {
            id: 2,
            title: "Job Title | Company Name",
            delay: "delay-500"
        },
        {
            id: 3,
            title: "Job Title | Company Name",
            delay: "delay-700"
        },
        {
            id: 4,
            title: "Job Title | Company Name",
            delay: "delay-900"
        }
    ];

    return (
        <div className="bg-[#E5E5E5] py-16 font-satoshi">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {jobCards.map((job) => (
                        <div
                            key={job.id}
                            className={`bg-white rounded-lg border-2 border-gray-400 p-6 transition-all duration-700 ease-out hover:scale-105 hover:shadow-lg ${job.delay} ${
                                isVisible
                                    ? 'opacity-100 translate-y-0'
                                    : 'opacity-0 translate-y-8'
                            }`}
                        >
                            {/* Image Placeholder */}
                            <div className="w-full h-64 bg-gray-600 rounded-lg mb-6"></div>

                            {/* Job Title and Apply Button Row */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-black">
                                    {job.title}
                                </h3>
                                <button className="bg-black text-white font-semibold px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                                    Apply
                                </button>
                            </div>

                            {/* Read More Link */}
                            <button className="text-black font-medium text-sm hover:text-gray-700 transition-colors duration-200 underline">
                                Read more
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default JobOpportunitiesGrid;