import React from "react";
import iphoneMockup from "@/assets/angelaharris/iphoneMockup.png";
import { LuCircleCheckBig } from "react-icons/lu";

const CoachFeatures: React.FC = () => {
  const features = [
    "Highlights & Video Clips",
    "Stats & Measurables",
    "Academic Info & GPA",
    "Direct Contact Info",
    "Shareable Recruiting Link",
  ];

  return (
    <section className="bg-[#004225] py-20 px-6 md:px-12 lg:px-24 min-h-175 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Text Content */}
        <div className="space-y-10 text-white max-w-lg order-2 lg:order-1">
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
            Everything a coach needs in one place.
          </h2>

          <ul className="space-y-5">
            {features.map((item, index) => (
              <li key={index} className="flex items-center gap-4 group">
                <LuCircleCheckBig className="w-6 h-6 text-[white/70] group-hover:text-white transition-colors duration-300 stroke-[1.5]" />
                <span className="text-lg md:text-xl font-normal text-[#FBFBFB]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Phone Mockup */}
        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <img
            src={iphoneMockup}
            alt="Athlete performing"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default CoachFeatures;
