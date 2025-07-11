export default function CTASection() {
    return (
        <div className="w-full py-16 px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto text-center">
                {/* CTA Text */}
                <p className="font-satoshi text-2xl md:text-3xl font-medium text-black mb-8 italic">
                    These partnerships are just a glimpse of the impact Lucieg Consulting delivers. We're passionate about understanding your unique challenges and connecting you with the talent that will drive your next chapter of growth.
                </p>

                {/* CTA Button */}
                <button className="bg-black text-white font-satoshi text-lg font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    Get a Free Consultation
                </button>
            </div>
        </div>
    );
}