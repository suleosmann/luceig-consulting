"use client"
import React from 'react';
import Image from 'next/image';
import TpicapLogo from "@/public/assets/tpicap-logo.svg";

const TpicapSection = () => {
    return (
        <div className="bg-[#E5E5E5] py-16 font-satoshi">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Title Section */}
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
                        TPICAP
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-700 italic">
                        Conquering Talent Peaks Together
                    </p>
                </div>

                {/* Main Content Container */}
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">

                    {/* Left Logo */}
                    <div className="flex-shrink-0">
                        <div className="w-64 h-64 flex items-center justify-center">
                            <Image
                                src={TpicapLogo}
                                alt="TPICAP logo"
                                className="w-64 h-64 object-contain"
                            />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 space-y-8">

                        {/* The Story Section */}
                        <div>
                            <h3 className="text-xl font-semibold text-black mb-4">
                                <span className="font-bold">The Story:</span> "As a company, we were climbing Mount Everest. Hirematch got us to Basecamp from a hiring, recruiting systems, processes, and structures perspective. And they've left us with the right supplies we need to continue to scale that mountain even further."
                            </h3>
                        </div>

                        {/* Client Voice Section */}
                        <div>
                            <p className="text-lg text-gray-700">
                                <span className="font-semibold text-black">Client Voice:</span> <span className="italic">Mame Konate, Director of HR and Operations</span>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TpicapSection;