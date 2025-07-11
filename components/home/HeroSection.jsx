"use client";
import Image from 'next/image';
import HeroImage from '@/public/assets/hero-image.jpg';
import HeroLogo from "@/public/assets/hero-logo.svg";

const HeroSection = () => {
    return (
        <div className="w-full h-[80vh] min-h-[600px] flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="relative w-full max-w-9xl h-[672px] rounded-lg overflow-hidden">
                <Image
                    src={HeroImage}
                    alt="Team collaboration in modern office"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Mobile Layout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 py-8 md:hidden">
                    <div className="text-center mb-8">
                        <h1 className="font-satoshi text-2xl sm:text-3xl font-bold text-white leading-tight italic">
                            Your Partner in Building<br />
                            High-Impact Teams
                        </h1>
                    </div>

                    <div className="flex-shrink-0">
                        <div className="w-48 h-54 flex items-center justify-center">
                            <Image
                                src={HeroLogo}
                                alt="Lucieg Consulting Logo"
                                width={192}
                                height={216}
                                className="w-48 h-54 object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Tablet Layout */}
                <div className="absolute inset-0 hidden md:flex lg:hidden flex-col items-center justify-center px-8 py-12">
                    <div className="text-center mb-12">
                        <h1 className="font-satoshi text-4xl font-bold text-white leading-tight italic">
                            Your Partner in Building<br />
                            High-Impact Teams
                        </h1>
                    </div>

                    <div className="flex-shrink-0">
                        <div className="w-64 h-72 flex items-center justify-center">
                            <Image
                                src={HeroLogo}
                                alt="Lucieg Consulting Logo"
                                width={256}
                                height={288}
                                className="w-64 h-72 object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Desktop Layout - Original Design */}
                <div className="absolute inset-0 hidden lg:flex items-center justify-between px-20">
                    <div className="flex-1 max-w-2xl mt-96">
                        <h1 className="font-satoshi text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight italic">
                            Your Partner in Building<br />
                            High-Impact Teams
                        </h1>
                    </div>

                    <div className="flex-shrink-0 ml-8 mt-24">
                        <div className="w-[379px] h-[426px] flex items-center justify-center">
                            <Image
                                src={HeroLogo}
                                alt="Lucieg Consulting Logo"
                                width={379}
                                height={426}
                                className="w-[379px] h-[426px]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;