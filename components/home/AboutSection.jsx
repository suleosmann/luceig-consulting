import GroupImage from "@/public/assets/group-image.jpg"
import Image from "next/image";

export default function AboutSection() {
    return (
        <div className="w-full  py-10 px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-12">
                    {/* Text Content */}
                    <div className="flex-1 lg:max-w-[740px]">
                        <p className="font-satoshi text-[24px] font-semibold text-gray-800 leading-relaxed italic">
                            At Lucieg Consulting, we believe that the right talent can transform
                            your business. We're not just recruiters; we're an extension of your
                            team, dedicated to helping you scale your recruitment needs and
                            build impactful, lasting teams together.
                        </p>
                    </div>

                    {/* Image */}
                    <div className="flex-shrink-0 -mb-36">
                        <div className="relative w-[413px] h-[333px] border-2 border-gray-700 rounded-lg overflow-hidden">
                            <Image
                                src={GroupImage}
                                alt="Lucieg Consulting team members"
                                fill
                                className="object-cover object-center"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}