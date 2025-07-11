"use client"
import React from 'react';
import Image from 'next/image';
import AxaLogo from "@/public/assets/axa-logo.svg";

const AxaSection = () => {
    return (
        <div className="bg-white py-16 font-satoshi">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Title Section */}
                <div className="text-right mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
                        AXA
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-700 italic">
                        Laying the Foundation for Future Growth
                    </p>
                </div>

                {/* Main Content Container */}
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">

                    {/* Left Content */}
                    <div className="flex-1 space-y-8">

                        {/* The Story Section */}
                        <div>
                            <h3 className="text-xl font-semibold text-black mb-4">
                                <span className="font-bold">The Story:</span> "Lucieg Consulting haven't just hired great people for us, they've set the foundations for the next 3 years in terms of Axa growth and story."
                            </h3>
                        </div>

                        {/* Client Voice Section */}
                        <div>
                            <p className="text-lg text-gray-700">
                                <span className="font-semibold text-black">Client Voice:</span> <span className="italic">Frédéric Clément, Global Head of HR at Axa HQ</span>
                            </p>
                        </div>

                    </div>

                    {/* Right Logo */}
                    <div className="flex-shrink-0">
                        <div className="w-64 h-64 flex items-center justify-center">
                            <Image
                                src={AxaLogo}
                                alt="AXA logo"
                                className="w-64 h-64 object-contain"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AxaSection;