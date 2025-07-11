"use client"
import React from 'react';
import Image from 'next/image';
import DevoteamLogo from "@/public/assets/devoteam-logo.svg";

const DevoteamSection = () => {
    return (
        <div className="bg-[#E5E5E5] py-16 font-satoshi">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Title Section */}
                <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
                        Devoteam
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-700 italic">
                        Scaling Talent with Strategic Partnership
                    </p>
                </div>

                {/* Main Content Container */}
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">

                    {/* Left Logo */}
                    <div className="flex-shrink-0">
                        <div className="w-64 h-64 flex items-center justify-center">
                            <Image
                                src={DevoteamLogo}
                                alt="Devoteam logo"
                                className="w-64 h-64 object-contain"
                            />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 space-y-8 md:mx-24">

                        {/* The Story Section */}
                        <div>
                            <h3 className="text-xl font-semibold text-black mb-4">
                                <span className="font-bold">The Story:</span> "If someone I knew were considering partnering with Lucieg consulting, I'd say if you need to ramp up hiring of the right talent — do it. You'll get instant impact, minimal downtime in recruiting, they're long-term partners and you benefit from a variety of resources immediately available in your team."
                            </h3>
                        </div>

                        {/* Client Voice Section */}
                        <div>
                            <p className="text-lg text-gray-700">
                                <span className="font-semibold text-black">Client Voice:</span> <span className="italic">Christelle Chappaz, Chief Talent & Learning Officer at Devoteam</span>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevoteamSection;