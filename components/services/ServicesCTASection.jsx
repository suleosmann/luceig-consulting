export default function CTASection() {
    return (
        <div className="w-full py-16 px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="max-w-4xl mx-auto text-center">
                {/* CTA Text */}
                <p className="font-satoshi text-2xl md:text-3xl font-medium text-black mb-8 italic">
                    Whether you're looking for an individual contributor or a visionary leader, Lucieg Consulting is your strategic partner. Let's discuss your unique recruitment needs and discover how our expertise can accelerate your growth.
                </p>

                {/* CTA Button */}
                <button className="bg-black text-white font-satoshi text-lg font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                    Get a Free Consultation
                </button>
            </div>
        </div>
    );
}