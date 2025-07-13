"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import PassionImage from "@/public/assets/passion-led-us-here.jpg";
import WorkspaceImage from "@/public/assets/modern-workspace.jpg";

const BuildFutureSection = () => {
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
                    <h2 className="text-4xl md:text-5xl font-bold text-black italic">
                        Build Your Future With Lucieg Consulting
                    </h2>
                </div>

                {/* First Section - Passion Led Us Here */}
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-20">

                    {/* Left Content */}
                    <div className={`flex-1 space-y-6 transition-all duration-700 ease-out delay-300 ${
                        isVisible
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-8'
                    }`}>
                        <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                            Are you passionate about connecting talent with opportunity? Do you thrive in a dynamic,
                            results-driven environment where your contributions directly impact client success? At
                            Lucieg Consulting, we're a team of dedicated professionals committed to redefining
                            recruitment. We believe in fostering a collaborative culture where expertise is
                            celebrated, innovation is encouraged, and every individual has the chance to grow.
                        </p>
                    </div>

                    {/* Right Image */}
                    <div className={`flex-1 transition-all duration-700 ease-out delay-500 ${
                        isVisible
                            ? 'opacity-100 translate-x-0 scale-100'
                            : 'opacity-0 translate-x-8 scale-95'
                    }`}>
                        <div className="relative">
                            <Image
                                src={PassionImage}
                                alt="Passion led us here - feet standing on sidewalk"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Second Section - Current Opportunities */}
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

                    {/* Left Image */}
                    <div className={`flex-1 order-2 lg:order-1 transition-all duration-700 ease-out delay-700 ${
                        isVisible
                            ? 'opacity-100 translate-x-0 scale-100'
                            : 'opacity-0 -translate-x-8 scale-95'
                    }`}>
                        <div className="relative">
                            <Image
                                src={WorkspaceImage}
                                alt="Modern workspace with laptops and office setup"
                                className="w-full h-auto rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className={`flex-1 order-1 lg:order-2 space-y-6 transition-all duration-700 ease-out delay-900 ${
                        isVisible
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-8'
                    }`}>
                        <h3 className="text-4xl md:text-5xl text-right font-bold text-black italic">
                            Explore Our Current Opportunities
                        </h3>
                        <p className="text-lg md:text-xl text-gray-800 leading-relaxed text-center">
                            We are always looking for talented individuals to join our growing team. Below are our currently
                            available positions.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BuildFutureSection;