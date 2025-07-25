"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import OfficeImage from "@/public/assets/office-meeting.jpg";

const RecruitmentServicesSection = () => {
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

                {/* Main Content Container */}
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16 mb-20">

                    {/* Left Image */}
                    <div className={`flex-1 transition-all duration-700 ease-out ${
                        isVisible
                            ? 'opacity-100 translate-x-0 scale-100'
                            : 'opacity-0 -translate-x-8 scale-95'
                    }`}>
                        <div className="w-full">
                            <Image
                                src={OfficeImage}
                                alt="Office meeting - recruitment services"
                                className="w-full h-96 object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className={`flex-1 space-y-6 transition-all duration-700 ease-out delay-200 ${
                        isVisible
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-8'
                    }`}>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black italic">
                            Our Recruitment Services
                        </h2>

                        <p className={`text-lg md:text-xl text-gray-700 leading-relaxed transition-all duration-700 ease-out delay-400 ${
                            isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4'
                        }`}>
                            We offer comprehensive, flexible, and efficient recruitment solutions meticulously designed to meet your specific budget, critical deadlines, and ambitious hiring goals. We partner with you every step of the way to ensure a seamless and successful talent acquisition journey.
                        </p>
                    </div>
                </div>

                {/* How We Work Section */}
                <div className={`space-y-6 transition-all duration-700 ease-out delay-500 ${
                    isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                }`}>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black italic">
                        How We Work
                    </h2>

                    <p className={`text-lg md:text-xl text-gray-700 leading-relaxed max-w-5xl transition-all duration-700 ease-out delay-700 ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-4'
                    }`}>
                        Our streamlined and transparent process ensures that we identify, attract, and place the ideal candidates who will thrive within your organization. We leverage our expertise to deliver results, often closing vacancies in
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentServicesSection;