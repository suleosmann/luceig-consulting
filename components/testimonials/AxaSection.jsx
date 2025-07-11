"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import AxaLogo from "@/public/assets/axa-logo.svg";

const AxaSection = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-white py-16 font-satoshi">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Title Section */}
                <div className={`text-right mb-16 transition-all duration-700 ease-out ${
                    isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                }`}>
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
                    <div className={`flex-1 space-y-8 transition-all duration-700 ease-out delay-300 ${
                        isVisible
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-8'
                    }`}>

                        {/* The Story Section */}
                        <div>
                            <h3 className="text-xl font-semibold text-black mb-4">
                                <span className="font-bold">The Story:</span> "Lucieg Consulting haven't just hired great people for us, they've set the foundations for the next 3 years in terms of Axa growth and story."
                            </h3>
                        </div>

                        {/* Client Voice Section */}
                        <div className={`transition-all duration-700 ease-out delay-500 ${
                            isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4'
                        }`}>
                            <p className="text-lg text-gray-700">
                                <span className="font-semibold text-black">Client Voice:</span> <span className="italic">Frédéric Clément, Global Head of HR at Axa HQ</span>
                            </p>
                        </div>

                    </div>

                    {/* Right Logo */}
                    <div className={`flex-shrink-0 transition-all duration-700 ease-out delay-400 ${
                        isVisible
                            ? 'opacity-100 translate-x-0 scale-100'
                            : 'opacity-0 translate-x-8 scale-95'
                    }`}>
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