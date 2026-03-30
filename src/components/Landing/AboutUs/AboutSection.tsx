import React from "react";
import { MdVerified } from "react-icons/md";

const AboutSection: React.FC = () => {
  const features = [
    "Build a professional athlete recruiting profile",
    "Create and organize highlight reels",
    "Share a simple recruiting link",
    "Follow a grade-by-grade roadmap",
    "Learn how the recruiting process actually works",
  ];

  return (
    <section className="bg-white py-16 md:py-24 px-4 md:px-6 font-sans">
      <div className="container mx-auto text-center">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#181D27] mb-3 md:mb-4">
            About Highlightz
          </h2>
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-[#181D27] mb-4 md:mb-8">
            The Smarter Way to Navigate College Recruiting
          </h3>
          <p className="text-[#6C7787] text-sm md:text-base leading-relaxed max-w-3xl mx-auto opacity-80 px-2">
            Highlightz is the digital recruiting companion for student-athletes
            and their parents. We help athletes showcase their talent while
            giving parents the education and roadmap they need to navigate the
            recruiting process with confidence.
          </p>
        </div>

        {/* Feature Tags Container */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12 md:mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 md:gap-3 bg-[#F4FAF6] px-4 py-3 md:px-6 md:py-4 rounded-full shadow-sm shadow-emerald-100/50 border border-emerald-50/50 hover:scale-105 transition-transform duration-200 cursor-default w-auto max-w-full"
            >
              <MdVerified
                size={16}
                className="text-[#00A849] shrink-0 md:w-4.5 md:h-4.5"
              />
              <span className="text-[#323C4B] font-bold text-xs md:text-sm text-left wrap-break-word">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom Footer Text */}
        <div>
          <p className="text-[#4A5568] text-xs md:text-sm leading-relaxed opacity-70 px-2">
            Everything athletes and parents need — in one platform. Because
            recruiting success isn't just about talent. It's about preparation,
            visibility, and opportunity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
