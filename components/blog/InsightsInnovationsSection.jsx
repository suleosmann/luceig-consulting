"use client"
import React, { useEffect, useState } from 'react';

const InsightsInnovationsSection = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-[#E5E5E5] py-16 font-satoshi">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Title Section */}
                <div className={`text-center mb-16 transition-all duration-700 ease-out ${
                    isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                }`}>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black italic mb-8">
                        Insights & Innovations
                    </h2>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-5xl mx-auto">
                        Your go-to source for the latest trends, expert insights, and practical advice in
                        talent acquisition and team building. Here, we share our knowledge to help
                        organizations navigate the complexities of recruitment and empower
                        professionals to advance their careers. Dive in and discover how to build more
                        impactful teams and foster a thriving workforce.
                    </p>
                </div>

                {/* Cards Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Card 1 */}
                    <div className={`bg-white rounded-lg border border-gray-300 overflow-hidden transition-all duration-700 ease-out delay-300 hover:scale-105 hover:shadow-lg ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}>
                        {/* Image Placeholder */}
                        <div className="w-full h-64 bg-gray-600"></div>

                        {/* Card Content */}
                        <div className="p-6 space-y-4">
                            {/* Category Tag */}
                            <div className="inline-block">
                                <span className="bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                                    News & Updates
                                </span>
                            </div>

                            {/* Card Text */}
                            <p className="text-gray-800 text-base leading-relaxed">
                                In today's fast-paced market, every week a vacancy remains open can cost your business.
                                Learn how Lucieg Consulting's expedited process ensures you get top talent swiftly without
                                compromising on quality...
                            </p>

                            {/* Read More Button */}
                            <button className="text-black font-semibold text-sm hover:text-gray-700 transition-colors duration-200">
                                Read More
                            </button>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className={`bg-white rounded-lg border border-gray-300 overflow-hidden transition-all duration-700 ease-out delay-500 hover:scale-105 hover:shadow-lg ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}>
                        {/* Image Placeholder */}
                        <div className="w-full h-64 bg-gray-600"></div>

                        {/* Card Content */}
                        <div className="p-6 space-y-4">
                            {/* Category Tag */}
                            <div className="inline-block">
                                <span className="bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                                    News & Updates
                                </span>
                            </div>

                            {/* Card Text */}
                            <p className="text-gray-800 text-base leading-relaxed">
                                In today's fast-paced market, every week a vacancy remains open can cost your business.
                                Learn how Lucieg Consulting's expedited process ensures you get top talent swiftly without
                                compromising on quality...
                            </p>

                            {/* Read More Button */}
                            <button className="text-black font-semibold text-sm hover:text-gray-700 transition-colors duration-200">
                                Read More
                            </button>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className={`bg-white rounded-lg border border-gray-300 overflow-hidden transition-all duration-700 ease-out delay-700 hover:scale-105 hover:shadow-lg ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}>
                        {/* Image Placeholder */}
                        <div className="w-full h-64 bg-gray-600"></div>

                        {/* Card Content */}
                        <div className="p-6 space-y-4">
                            {/* Category Tag */}
                            <div className="inline-block">
                                <span className="bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1 rounded-full">
                                    News & Updates
                                </span>
                            </div>

                            {/* Card Text */}
                            <p className="text-gray-800 text-base leading-relaxed">
                                In today's fast-paced market, every week a vacancy remains open can cost your business.
                                Learn how Lucieg Consulting's expedited process ensures you get top talent swiftly without
                                compromising on quality...
                            </p>

                            {/* Read More Button */}
                            <button className="text-black font-semibold text-sm hover:text-gray-700 transition-colors duration-200">
                                Read More
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InsightsInnovationsSection;