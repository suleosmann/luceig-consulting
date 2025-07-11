"use client"
import React from 'react';

const ProcessStepsSection = () => {
    return (
        <div className="bg-[#C6C5C5] py-16 font-satoshi">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Grid Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* Step 1 */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <span className="text-6xl md:text-7xl font-bold text-black">1</span>
                            <div className="pt-2">
                                <h3 className="text-xl md:text-2xl font-semibold text-black mb-2">
                                    Understanding Your Unique Needs
                                </h3>
                                <p className="text-lg text-gray-600 mb-4">
                                    (Consultation & Strategy)
                                </p>
                            </div>
                        </div>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            We begin with an in-depth consultation to truly understand your company culture, specific role requirements, team dynamics, and long-term strategic objectives. This foundational step ensures we're perfectly aligned with your vision.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <span className="text-6xl md:text-7xl font-bold text-black">2</span>
                            <div className="pt-2">
                                <h3 className="text-xl md:text-2xl font-semibold text-black mb-2">
                                    Targeted Talent Sourcing & Attraction
                                </h3>
                            </div>
                        </div>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            Leveraging our extensive global network and innovative sourcing strategies, we meticulously identify and engage top-tier talent. Our consultants, with more than 10 years of experience in recruitment worldwide, know where to find the candidates who aren't just looking for a job, but a career.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <span className="text-6xl md:text-7xl font-bold text-black">3</span>
                            <div className="pt-2">
                                <h3 className="text-xl md:text-2xl font-semibold text-black mb-2">
                                    Rigorous Vetting & Interviewing
                                </h3>
                            </div>
                        </div>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            We conduct thorough screenings and interviews — having completed +2500 interviews — to assess not only skills and experience but also cultural fit and potential for growth. We present you with a curated shortlist of highly qualified candidates who are ready to make an immediate impact.
                        </p>
                    </div>

                    {/* Step 4 */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <span className="text-6xl md:text-7xl font-bold text-black">4</span>
                            <div className="pt-2">
                                <h3 className="text-xl md:text-2xl font-semibold text-black mb-2">
                                    Seamless Placement & Ongoing Support
                                </h3>
                            </div>
                        </div>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            From offer management to onboarding assistance, we ensure a smooth transition for both you and your new hire. Our commitment doesn't end at placement; we offer a no-cost replacement on underachieving hires or for any reason they did not work out, guaranteeing your satisfaction and the long-term success of the placement.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProcessStepsSection;