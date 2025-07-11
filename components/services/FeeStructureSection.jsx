"use client"
import React, { useEffect, useState } from 'react';

const FeeStructureSection = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-[#4A4A4A] py-16 font-satoshi">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Title */}
                <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white italic text-center mb-16 transition-all duration-700 ease-out ${
                    isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                }`}>
                    How We Structure Our Fees
                </h2>

                {/* Cards Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* Regular Level Positions Card */}
                    <div className={`bg-white rounded-lg p-8 space-y-6 transition-all duration-700 ease-out delay-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-50 group ${
                        isVisible
                            ? 'opacity-100 translate-x-0 translate-y-0'
                            : 'opacity-0 -translate-x-8 translate-y-4'
                    }`}>
                        <h3 className="text-2xl md:text-3xl font-bold text-black mb-4 group-hover:text-gray-800 transition-colors duration-300">
                            Regular Level Positions
                        </h3>
                        <p className="text-lg text-gray-600 mb-6 group-hover:text-gray-700 transition-colors duration-300">
                            (Without Management Responsibilities)
                        </p>

                        <p className="text-base md:text-lg text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                            For roles that do not involve management duties or highly specialized technical requirements, our fee is <span className="font-bold text-black">10%</span> of the placed candidate's annual salary. This includes a wide range of essential positions that keep your business running smoothly.
                        </p>
                    </div>

                    {/* Specialized & Management Roles Card */}
                    <div className={`bg-white rounded-lg p-8 space-y-6 transition-all duration-700 ease-out delay-500 hover:scale-105 hover:shadow-2xl hover:bg-gray-50 group ${
                        isVisible
                            ? 'opacity-100 translate-x-0 translate-y-0'
                            : 'opacity-0 translate-x-8 translate-y-4'
                    }`}>
                        <h3 className="text-2xl md:text-3xl font-bold text-black mb-4 group-hover:text-gray-800 transition-colors duration-300">
                            Specialized & Management Roles
                        </h3>

                        <p className="text-base md:text-lg text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                            For critical leadership positions, roles demanding technical management expertise, or those requiring unique and niche technologies, our fee is <span className="font-bold text-black">15%</span> of the placed candidate's annual salary. These roles often require a more extensive search and specialized vetting, reflecting the high value they bring to your organization.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FeeStructureSection;