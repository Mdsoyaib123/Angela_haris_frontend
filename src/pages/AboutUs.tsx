import AboutSection from "@/components/Landing/AboutUs/AboutSection";
import CTASection from "@/components/Landing/AboutUs/CTASection";
import FounderStory from "@/components/Landing/AboutUs/FounderStory";
import MissionSection from "@/components/Landing/AboutUs/MissionSection";
import VisionSection from "@/components/Landing/AboutUs/VisionSection";
import WhyChooseSection from "@/components/Landing/AboutUs/WhyChooseSection";
// import WhyParentsLoveSection from "@/components/Landing/Landing/WhyParentsLoveSection";

export default function AboutUs() {
  return (
    <>
      <AboutSection />
      <MissionSection />
      <FounderStory />
      <WhyChooseSection />
      <VisionSection />
      {/* <WhyParentsLoveSection /> */}
      <CTASection />
    </>
  );
}
