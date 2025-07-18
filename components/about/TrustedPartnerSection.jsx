"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import BusinessMeetingImage from "@/public/assets/macbook.jpg";

const TrustedPartnerSection = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-[#E5E5E5] py-16 font-satoshi relative">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Main Content Container */}
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16 mb-16">

                    {/* Left Content */}
                    <div className={`flex-1 space-y-6 transition-all duration-700 ease-out ${
                        isVisible
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-8'
                    }`}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black italic">
                            Your Trusted Recruitment Partner
                        </h2>

                        <p className={`text-lg md:text-xl text-gray-700 leading-relaxed transition-all duration-700 ease-out delay-300 ${
                            isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4'
                        }`}>
                            We understand that talent is the lifeblood of any successful organization. We're not just in the business of filling vacancies; we're in the business of forging powerful partnerships that unlock potential and drive unparalleled growth. Think of us as an extension of your own team, deeply invested in your success. We believe that by working hand-in-hand, we can co-create the high-impact teams that will propel your business forward.
                        </p>
                    </div>

                    {/* Right Image */}
                    <div className={`flex-1 transition-all duration-700 ease-out delay-200 ${
                        isVisible
                            ? 'opacity-100 translate-x-0 scale-100'
                            : 'opacity-0 translate-x-8 scale-95'
                    }`}>
                        <div className="w-full group">
                            <Image
                                src={BusinessMeetingImage}
                                alt="Business meeting - trusted recruitment partnership"
                                className="w-full h-96 object-cover rounded-lg transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl"
                            />
                        </div>
                    </div>

                </div>

                {/* Mission and Vision Cards - Positioned to overlap */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10" style={{marginBottom: '-150px'}}>

                    {/* Our Mission Card */}
                    <div className={`bg-[#BFBFBF] rounded-lg p-8 border border-gray-400 transition-all duration-700 ease-out delay-500 hover:scale-105 hover:shadow-lg hover:bg-[#C5C5C5] ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}>
                        <h3 className="text-2xl md:text-3xl font-bold text-black italic mb-6">
                            Our Mission
                        </h3>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            At Lucieg Consulting, our mission is to empower organizations to achieve their strategic goals by connecting them with exceptional talent. We are dedicated to scaling our clients' recruitment needs, building impactful, lasting teams, and fostering long-term partnerships built on trust, efficiency, and proven results.
                        </p>
                    </div>

                    {/* Our Vision Card */}
                    <div className={`bg-[#BFBFBF] rounded-lg p-8 border border-gray-400 transition-all duration-700 ease-out delay-700 hover:scale-105 hover:shadow-lg hover:bg-[#C5C5C5] ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}>
                        <h3 className="text-2xl md:text-3xl font-bold text-black italic mb-6">
                            Our Vision
                        </h3>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            To be the globally recognized leader in talent acquisition, celebrated for our innovative approach, our commitment to client success, and our unparalleled ability to forge connections that transform businesses and careers worldwide.
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default TrustedPartnerSection;