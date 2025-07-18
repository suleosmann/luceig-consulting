'use client';

import GroupImage from "@/public/assets/ornament.jpg"
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AboutSection() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full py-10 px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-12">
                    {/* Text Content */}
                    <div className={`flex-1 lg:max-w-[740px] transition-all duration-700 ease-out ${
                        isVisible
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}>
                        <p className="font-satoshi text-[24px] font-semibold text-gray-800 leading-relaxed italic">
                            At Lucieg Consulting, we believe that the right talent can transform
                            your business. We're not just recruiters; we're an extension of your
                            team, dedicated to helping you scale your recruitment needs and
                            build impactful, lasting teams together.
                        </p>
                    </div>

                    {/* Image */}
                    <div className={`flex-shrink-0 -mb-36 transition-all duration-700 ease-out delay-200 ${
                        isVisible
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-8'
                    }`}>
                        <div className="relative w-[413px] h-[333px] border-2 border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-gray-600">
                            <Image
                                src={GroupImage}
                                alt="Lucieg Consulting team members"
                                fill
                                className="object-cover object-center transition-transform duration-500 hover:scale-110"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}