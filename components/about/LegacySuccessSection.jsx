"use client"
import React from 'react';

const LegacySuccessSection = () => {
    return (
        <div className="bg-[#E5E5E5] py-16 font-satoshi">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Title */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black italic text-center mb-16">
                    A Legacy of Success
                </h2>

                {/* Stats Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">

                    {/* Stat 1 - Interviews */}
                    <div className="text-center space-y-4">
                        <div className="text-5xl md:text-6xl  font-bold text-[#8F8F8F]">
                            2500+
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold text-black">
                            Interviews Conducted
                        </h3>
                    </div>

                    {/* Stat 2 - Years */}
                    <div className="text-center space-y-4">
                        <div className="text-5xl md:text-6xl font-bold text-[#8F8F8F]">
                            10+ years
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold text-black">
                            of Global Recruitment
                        </h3>
                    </div>

                    {/* Stat 3 - Placements */}
                    <div className="text-center space-y-4">
                        <div className="text-5xl md:text-6xl  font-bold text-[#8F8F8F]">
                            30+
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold text-black">
                            Worldwide Placements
                        </h3>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LegacySuccessSection;