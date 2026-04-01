import CoachFeatures from "@/components/Landing/Landing/CoachFeatures";
import HowItWorks from "@/components/Landing/Landing/HowItWorks";
import PricingSection from "@/components/Landing/Landing/PricingSection";
// import ProgramMembers from "@/components/Landing/Landing/ProgramMembers";
import RecruitingSection from "@/components/Landing/Landing/RecruitingSection";
import SolutionsSection from "@/components/Landing/Landing/SolutionsSection";
import Testimonial from "@/components/Landing/Landing/Testimonial";
import RecruitingRoadmap from "../components/Landing/Landing/RecruitingRoadmap";
import Hero from "@/components/Landing/Landing/HeroSection";
import WhyParentsLove from "@/components/Landing/Landing/WhyParentsLove";

const LandingPage = () => {
  return (
    <>
      <Hero />
      {/* <ProgramMembers /> */}
      <RecruitingSection />
      <SolutionsSection />
      <CoachFeatures />
      <HowItWorks />
      <PricingSection />
      <WhyParentsLove />
      <Testimonial />
      <RecruitingRoadmap />

    </>
  );
};

export default LandingPage;
