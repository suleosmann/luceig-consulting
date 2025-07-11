"use client";

import PartnershipIcon from "@/public/assets/partnership-icon.svg"
import PlacementIcon from "@/public/assets/placement-icon.svg"
import TalentIcon from "@/public/assets/talent-icon.svg"
import GuaranteeIcon from "@/public/assets/guarantee-icon.svg"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function WhyChooseUsSection() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.1,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const features = [
        {
            icon: PartnershipIcon,
            alt: "Partnership icon",
            title: "A Partnership Built on Results",
            description: "We work as your direct partner, focusing on tangible results and achievable outcomes that drive your success. We don't just fill roles; we build relationships that yield long-term impact.",
            delay: "200ms"
        },
        {
            icon: PlacementIcon,
            alt: "Placement icon",
            title: "Rapid & Effective Placement",
            description: "With extensive experience, we're adept at filling a variety of vacancies within a short timeframe. In fact, we pride ourselves on closing vacancies in 4 weeks or less!",
            delay: "400ms"
        },
        {
            icon: TalentIcon,
            alt: "Talent icon",
            title: "Ready-to-Start Talent, When You Need It",
            description: "We focus on delivering talent that's ready to hit the ground running, ensuring minimal downtime and immediate impact for your team.",
            delay: "600ms"
        },
        {
            icon: GuaranteeIcon,
            alt: "Guarantee icon",
            title: "Our Unwavering Guarantee",
            description: "We stand by our placements. If for any reason a hire doesn't work out or underperforms, we offer a no-cost replacement. That's our commitment to your satisfaction and peace of mind.",
            delay: "800ms"
        }
    ];

    return (
        <div className="w-full">
            <div className="h-4 w-full bg-[#8F8F8F]"></div>
            <div
                ref={sectionRef}
                className="py-16 px-4 sm:px-8 md:px-16 lg:px-24"
            >
                <div className="max-w-7xl mx-auto">
                    {/* Section Title */}
                    <h2
                        className={`font-satoshi text-4xl md:text-5xl font-bold text-black mb-16 italic transition-all duration-1000 ease-out ${
                            isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                        }`}
                    >
                        Why Choose Lucieg Consulting?
                    </h2>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`flex flex-col group transition-all duration-1000 ease-out ${
                                    isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-12'
                                }`}
                                style={{
                                    transitionDelay: isVisible ? feature.delay : '0ms'
                                }}
                            >
                                <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">
                                    <Image
                                        src={feature.icon}
                                        alt={feature.alt}
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 transition-all duration-300 group-hover:drop-shadow-lg"
                                    />
                                </div>
                                <h3 className="font-satoshi text-2xl font-bold text-black mb-4 italic transition-colors duration-300 group-hover:text-blue-600">
                                    {feature.title}
                                </h3>
                                <p className="font-satoshi text-lg text-gray-700 leading-relaxed transition-colors duration-300 group-hover:text-gray-900">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}