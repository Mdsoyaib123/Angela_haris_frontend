import React from "react";
import missionsection from "@/assets/angelaharris/missionsection.jpg";

const MissionSection: React.FC = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24 font-sans overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Text Content */}
        <div className="max-w-xl">
          <span className="text-[#00A849] text-xs font-bold uppercase tracking-wider block mb-6">
            Our Mission
          </span>

          <h2 className="text-4xl font-semibold text-[#181D27] leading-tight mb-8">
            Help every student-athlete turn their hard work into real recruiting
            opportunities.
          </h2>

          <p className="text-[#6C7787] text-lg leading-relaxed opacity-90">
            We believe athletes should never miss an opportunity simply because
            they didn't understand the process or didn't have the right tools.
            Highlightz gives parents clarity, structure, and visibility
            throughout the recruiting journey.
          </p>
        </div>

        {/* Image Container */}
        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10">
          <img
            src={missionsection}
            alt="Basketball player mid-dunk"
            className="w-full h-full object-cover aspect-4/3"
          />
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
