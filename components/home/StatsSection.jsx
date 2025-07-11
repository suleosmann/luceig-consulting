export default function StatsSection() {
    return (
        <div className="w-full bg-[#C6C5C5]">
            <div className="h-4 w-full bg-[#1A1A1A]"></div>
            <div className="py-24 px-4 sm:px-8 md:px-16 lg:px-56">
                <div className="max-w-7xl mx-auto">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
                        {/* Interviews Stat */}
                        <div className="text-center">
                            <h3 className="font-satoshi text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-4">
                                2500+
                            </h3>
                            <p className="font-satoshi text-xl font-semibold text-[#1A1A1A] mb-6">
                                Interviews Conducted
                            </p>
                            <p className="font-satoshi text-lg text-[#1A1A1A] leading-relaxed italic">
                                Our rigorous process ensures we find the perfect fit for your culture and needs.
                            </p>
                        </div>

                        {/* Experience Stat */}
                        <div className="text-center">
                            <h3 className="font-satoshi text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-4">
                                10+ years
                            </h3>
                            <p className="font-satoshi text-xl font-semibold text-[#1A1A1A] mb-6">
                                of Global Recruitment
                            </p>
                            <p className="font-satoshi text-lg text-[#1A1A1A] leading-relaxed italic">
                                Our recruitment consultants bring more than 10 years of experience in recruitment worldwide, providing invaluable insights and a vast network.
                            </p>
                        </div>

                        {/* Placements Stat */}
                        <div className="text-center">
                            <h3 className="font-satoshi text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-4">
                                30+
                            </h3>
                            <p className="font-satoshi text-xl font-semibold text-[#1A1A1A] mb-6">
                                Worldwide Placements
                            </p>
                            <p className="font-satoshi text-lg text-[#1A1A1A] leading-relaxed italic">
                                We've helped diverse clients across the globe build exceptional teams.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-4 w-full bg-[#8F8F8F]"></div>
        </div>
    );
}