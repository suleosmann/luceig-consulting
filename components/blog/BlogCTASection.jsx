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
                    Don't miss out on valuable insights! Subscribe to our newsletter for direct updates and exclusive content.
                </p>

                {/* CTA Button */}
                <button className={`bg-black text-white font-satoshi text-lg font-semibold px-8 py-4 rounded-lg transition-all duration-500 ease-out delay-300 hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95 ${
                    isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                }`}>
                    Subscribe to our Newsletter
                </button>
            </div>
        </div>
    );
}