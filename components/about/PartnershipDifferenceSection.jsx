"use client"
import React from 'react';
import Image from 'next/image';
import PartnershipIcon from "@/public/assets/partnership-icon.svg";
import PlacementIcon from "@/public/assets/placement-icon.svg";
import TalentIcon from "@/public/assets/talent-icon.svg";
import GuaranteeIcon from "@/public/assets/guarantee-icon.svg";

const PartnershipDifferenceSection = () => {
    return (
        <div className="bg-white py-32 font-satoshi">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Title */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black italic text-center mb-16">
                    The Difference is in Our Partnership.
                </h2>

                {/* Main Content Container */}
                <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16">

                    {/* Left Side - Icons Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Tangible Results */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex-shrink-0">
                                    <Image
                                        src={PartnershipIcon}
                                        alt="Partnership icon"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-semibold text-black">
                                        Tangible Results
                                    </h3>
                                </div>
                            </div>

                            {/* Unrivalled Efficiency */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex-shrink-0">
                                    <Image
                                        src={PlacementIcon}
                                        alt="Placement icon"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-semibold text-black">
                                        Unrivalled Efficiency
                                    </h3>
                                </div>
                            </div>

                            {/* Impactful Talent */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex-shrink-0">
                                    <Image
                                        src={TalentIcon}
                                        alt="Talent icon"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-semibold text-black">
                                        Impactful Talent
                                    </h3>
                                </div>
                            </div>

                            {/* Our Unwavering Commitment */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex-shrink-0">
                                    <Image
                                        src={GuaranteeIcon}
                                        alt="Guarantee icon"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-semibold text-black">
                                        Our Unwavering Commitment
                                    </h3>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Side - Description Text */}
                    <div className="flex-1">
                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                            In today's dynamic talent landscape, finding and securing the right fit isn't just about speed — it's about precision, insight, and an unwavering commitment to your vision. Here's what sets Lucieg Consulting apart, making us the ideal partner for your talent acquisition needs:
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PartnershipDifferenceSection;