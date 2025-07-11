"use client"
import React, { useEffect, useState } from 'react';

const LegacySuccessSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [animatedNumbers, setAnimatedNumbers] = useState({
        interviews: 0,
        years: 0,
        placements: 0
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);

            // Animate numbers
            const animateNumber = (target, key, duration = 2000) => {
                const startTime = Date.now();
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);

                    // Easing function for smooth animation
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(target * easeOut);

                    setAnimatedNumbers(prev => ({
                        ...prev,
                        [key]: current
                    }));

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                requestAnimationFrame(animate);
            };

            // Start number animations with delays
            setTimeout(() => animateNumber(2500, 'interviews'), 500);
            setTimeout(() => animateNumber(10, 'years'), 700);
            setTimeout(() => animateNumber(30, 'placements'), 900);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-[#E5E5E5] py-16 font-satoshi">
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-20 max-w-7xl mx-auto">

                {/* Title */}
                <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-black italic text-center mb-16 transition-all duration-700 ease-out ${
                    isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                }`}>
                    A Legacy of Success
                </h2>

                {/* Stats Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16">

                    {/* Stat 1 - Interviews */}
                    <div className={`text-center space-y-4 transition-all duration-700 ease-out delay-300 ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}>
                        <div className="text-5xl md:text-6xl font-bold text-[#8F8F8F] transform hover:scale-110 transition-transform duration-300">
                            {animatedNumbers.interviews.toLocaleString()}+
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold text-black">
                            Interviews Conducted
                        </h3>
                    </div>

                    {/* Stat 2 - Years */}
                    <div className={`text-center space-y-4 transition-all duration-700 ease-out delay-500 ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}>
                        <div className="text-5xl md:text-6xl font-bold text-[#8F8F8F] transform hover:scale-110 transition-transform duration-300">
                            {animatedNumbers.years}+ years
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold text-black">
                            of Global Recruitment
                        </h3>
                    </div>

                    {/* Stat 3 - Placements */}
                    <div className={`text-center space-y-4 transition-all duration-700 ease-out delay-700 ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}>
                        <div className="text-5xl md:text-6xl font-bold text-[#8F8F8F] transform hover:scale-110 transition-transform duration-300">
                            {animatedNumbers.placements}+
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