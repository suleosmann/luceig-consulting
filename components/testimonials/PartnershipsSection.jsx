"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import MicImage from "@/public/assets/mic-image.jpg";

const PartnershipsSection = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="py-16 font-satoshi">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Title Section */}
                <div className={`text-center mb-12 transition-all duration-700 ease-out ${
                    isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                }`}>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-mainColor italic mb-2">
                        Our Successful Partnerships
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600">
                        Driving Growth, Building Trust
                    </p>
                </div>

                {/* Main Content Container */}
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">

                    {/* Left Content */}
                    <div className={`lg:max-w-[631px] pt-16 transition-all duration-700 ease-out delay-300 ${
                        isVisible
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-8'
                    }`}>
                        <div className="text-mainColor font-semi-bold text-base md:text-[24px] font-normal leading-relaxed">
                            <p>
                                Our greatest achievements are reflected in the success of our clients. We don't just fill positions; we build enduring partnerships and deliver talent solutions that propel businesses forward. These stories are a testament to the impact we make and the trust we earn. Discover how we've helped diverse organizations achieve their strategic hiring goals and build high-impact teams.
                            </p>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className={`flex-1 flex justify-center lg:justify-end transition-all duration-700 ease-out delay-500 ${
                        isVisible
                            ? 'opacity-100 translate-x-0 scale-100'
                            : 'opacity-0 translate-x-8 scale-95'
                    }`}>
                        <div className="relative w-full max-w-md lg:max-w-lg">
                            <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg overflow-hidden shadow-lg">
                                <Image
                                    src={MicImage}
                                    alt="Successful business partnership handshake"
                                    className="w-[521px] h-[521px] object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnershipsSection;