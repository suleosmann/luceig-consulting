'use client';

import { useEffect, useState } from "react";

export default function CTASection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full py-16 px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto text-center">
                {/* CTA Text */}
                <p className={`font-satoshi text-2xl md:text-3xl font-medium text-black mb-8 italic transition-all duration-700 ease-out ${
                    isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                }`}>
                    Ready to make your mark in the world of recruitment? Join Lucieg Consulting and help us build the future of talent acquisition.                </p>

                {/* CTA Button */}
                <button href="/contact" className={`bg-black text-white font-satoshi text-lg font-semibold px-8 py-4 rounded-lg transition-all duration-500 ease-out delay-300 hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95 ${
                    isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                }`}>
                    Contact Us
                </button>
            </div>
        </div>
    );
}