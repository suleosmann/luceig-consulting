import Image from "next/image";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
      <>
        <HeroSection/>
          <AboutSection/>
          <WhyChooseUsSection/>
          <StatsSection/>
          <CTASection/>
      </>
  );
}
