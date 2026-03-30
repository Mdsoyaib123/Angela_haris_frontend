import React from "react";
import FounderStoryImg from "@/assets/angelaharris/c04e13752581ce4cad2d7d782bde10a7c57dc34e.jpg";

const FounderStory: React.FC = () => {
  return (
    <section className="bg-white py-24 px-6 md:px-12 lg:px-24 font-sans">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column: Founder/Parent Image */}
        <div className="relative order-2 lg:order-1">
          <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
            <img
              src={FounderStoryImg}
              alt="Highlightz Founder"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex flex-col space-y-6 order-1 lg:order-2">
          {/* Section Label */}
          <span className="bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] bg-clip-text text-transparent text-xs font-bold uppercase tracking-widest">
            Founder Story
          </span>

          {/* Main Heading */}
          <h2 className="text-4xl font-semibold text-[#181D27] leading-tight">
            Built by a Parent for Parents
          </h2>

          {/* Description Paragraphs */}
          <div className="space-y-4 text-[#6C7787] text-sm md:text-base leading-relaxed opacity-90">
            <p>
              Highlightz was created after seeing how confusing and overwhelming
              the recruiting process can be for parents. Most parents are left
              trying to figure things out through random advice from other
              parents, social media highlights, expensive recruiting services,
              and outdated information.
            </p>
            <p>
              And by the time many parents learn how recruiting actually works,
              they're already behind. Highlightz was built to change that.
            </p>
          </div>

          {/* Quote Block */}
          <div className="bg-[#F5FCF6] p-8 md:p-10 rounded-3xl mt-4">
            <p className="text-[#475569] text-sm md:text-[15px] italic leading-relaxed font-medium">
              "The goal was simple: Create a platform that gives athletes a
              professional way to showcase their talent while giving parents a
              clear roadmap to follow from middle school through high school,
              instead of guessing what to do next. Families can follow a system
              designed to help athletes maximize their opportunities."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderStory;
