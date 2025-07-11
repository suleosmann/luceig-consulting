import PartnershipIcon from "@/public/assets/partnership-icon.svg"
import PlacementIcon from "@/public/assets/placement-icon.svg"
import TalentIcon from "@/public/assets/talent-icon.svg"
import GuaranteeIcon from "@/public/assets/guarantee-icon.svg"
import Image from "next/image";

export default function WhyChooseUsSection() {
    return (
        <div className="w-full ">
            <div className="h-4 w-full bg-[#8F8F8F]"></div>
            <div className="py-16 px-4 sm:px-8 md:px-16 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    {/* Section Title */}
                    <h2 className="font-satoshi text-4xl md:text-5xl font-bold text-black mb-16 italic">
                        Why Choose Lucieg Consulting?
                    </h2>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                        {/* Partnership Feature */}
                        <div className="flex flex-col">
                            <div className="mb-6">
                                <Image
                                    src={PartnershipIcon}
                                    alt="Partnership icon"
                                    width={64}
                                    height={64}
                                    className="w-16 h-16"
                                />
                            </div>
                            <h3 className="font-satoshi text-2xl font-bold text-black mb-4 italic">
                                A Partnership Built on Results
                            </h3>
                            <p className="font-satoshi text-lg text-gray-700 leading-relaxed">
                                We work as your direct partner, focusing on tangible results and achievable outcomes that drive your success. We don't just fill roles; we build relationships that yield long-term impact.
                            </p>
                        </div>

                        {/* Placement Feature */}
                        <div className="flex flex-col">
                            <div className="mb-6">
                                <Image
                                    src={PlacementIcon}
                                    alt="Placement icon"
                                    width={64}
                                    height={64}
                                    className="w-16 h-16"
                                />
                            </div>
                            <h3 className="font-satoshi text-2xl font-bold text-black mb-4 italic">
                                Rapid & Effective Placement
                            </h3>
                            <p className="font-satoshi text-lg text-gray-700 leading-relaxed">
                                With extensive experience, we're adept at filling a variety of vacancies within a short timeframe. In fact, we pride ourselves on closing vacancies in 4 weeks or less!
                            </p>
                        </div>

                        {/* Talent Feature */}
                        <div className="flex flex-col">
                            <div className="mb-6">
                                <Image
                                    src={TalentIcon}
                                    alt="Talent icon"
                                    width={64}
                                    height={64}
                                    className="w-16 h-16"
                                />
                            </div>
                            <h3 className="font-satoshi text-2xl font-bold text-black mb-4 italic">
                                Ready-to-Start Talent, When You Need It
                            </h3>
                            <p className="font-satoshi text-lg text-gray-700 leading-relaxed">
                                We focus on delivering talent that's ready to hit the ground running, ensuring minimal downtime and immediate impact for your team.
                            </p>
                        </div>

                        {/* Guarantee Feature */}
                        <div className="flex flex-col">
                            <div className="mb-6">
                                <Image
                                    src={GuaranteeIcon}
                                    alt="Guarantee icon"
                                    width={64}
                                    height={64}
                                    className="w-16 h-16"
                                />
                            </div>
                            <h3 className="font-satoshi text-2xl font-bold text-black mb-4 italic">
                                Our Unwavering Guarantee
                            </h3>
                            <p className="font-satoshi text-lg text-gray-700 leading-relaxed">
                                We stand by our placements. If for any reason a hire doesn't work out or underperforms, we offer a no-cost replacement. That's our commitment to your satisfaction and peace of mind.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}