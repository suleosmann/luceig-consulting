"use client";

import { useEffect, useRef, useState } from "react";

export default function StatsSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [counters, setCounters] = useState({
        interviews: 0,
        experience: 0,
        placements: 0
    });
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    startCounting();
                }
            },
            {
                threshold: 0.3,
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

    const startCounting = () => {
        const targets = {
            interviews: 2500,
            experience: 10,
            placements: 30
        };

        const durations = {
            interviews: 2000,
            experience: 1500,
            placements: 1000
        };

        // Counter for interviews
        const interviewsInterval = setInterval(() => {
            setCounters(prev => {
                const increment = targets.interviews / (durations.interviews / 50);
                const newValue = Math.min(prev.interviews + increment, targets.interviews);
                if (newValue >= targets.interviews) {
                    clearInterval(interviewsInterval);
                    return { ...prev, interviews: targets.interviews };
                }
                return { ...prev, interviews: newValue };
            });
        }, 50);

        // Counter for experience
        const experienceInterval = setInterval(() => {
            setCounters(prev => {
                const increment = targets.experience / (durations.experience / 50);
                const newValue = Math.min(prev.experience + increment, targets.experience);
                if (newValue >= targets.experience) {
                    clearInterval(experienceInterval);
                    return { ...prev, experience: targets.experience };
                }
                return { ...prev, experience: newValue };
            });
        }, 50);

        // Counter for placements
        const placementsInterval = setInterval(() => {
            setCounters(prev => {
                const increment = targets.placements / (durations.placements / 50);
                const newValue = Math.min(prev.placements + increment, targets.placements);
                if (newValue >= targets.placements) {
                    clearInterval(placementsInterval);
                    return { ...prev, placements: targets.placements };
                }
                return { ...prev, placements: newValue };
            });
        }, 50);
    };

    const formatNumber = (num, type) => {
        if (type === 'interviews') {
            return Math.floor(num).toLocaleString() + '+';
        } else if (type === 'experience') {
            return Math.floor(num) + '+ years';
        } else if (type === 'placements') {
            return Math.floor(num) + '+';
        }
        return num;
    };

    const stats = [
        {
            number: formatNumber(counters.interviews, 'interviews'),
            title: "Interviews Conducted",
            description: "Our rigorous process ensures we find the perfect fit for your culture and needs.",
            delay: "200ms"
        },
        {
            number: formatNumber(counters.experience, 'experience'),
            title: "of Global Recruitment",
            description: "Our recruitment consultants bring more than 10 years of experience in recruitment worldwide, providing invaluable insights and a vast network.",
            delay: "400ms"
        },
        {
            number: formatNumber(counters.placements, 'placements'),
            title: "Worldwide Placements",
            description: "We've helped diverse clients across the globe build exceptional teams.",
            delay: "600ms"
        }
    ];

    return (
        <div className="w-full bg-[#C6C5C5]">
            <div className="h-4 w-full bg-[#1A1A1A]"></div>
            <div
                ref={sectionRef}
                className="py-24 px-4 sm:px-8 md:px-16 lg:px-56"
            >
                <div className="max-w-7xl mx-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`text-center group transition-all duration-1000 ease-out ${
                                    isVisible
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-12'
                                }`}
                                style={{
                                    transitionDelay: isVisible ? stat.delay : '0ms'
                                }}
                            >
                                <h3 className="font-satoshi text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-4 transition-all duration-300 group-hover:scale-105">
                                    {stat.number}
                                </h3>
                                <p className="font-satoshi text-xl font-semibold text-[#1A1A1A] mb-6 transition-colors duration-300 group-hover:text-gray-800">
                                    {stat.title}
                                </p>
                                <p className="font-satoshi text-lg text-[#1A1A1A] leading-relaxed italic transition-colors duration-300 group-hover:text-gray-800">
                                    {stat.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-4 w-full bg-[#8F8F8F]"></div>
        </div>
    );
}