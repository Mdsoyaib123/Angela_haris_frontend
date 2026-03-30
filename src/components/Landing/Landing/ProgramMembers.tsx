import React from "react";
import programMember1 from "@/assets/angelaharris/ProgramMembers1.png";
import programMember2 from "@/assets/angelaharris/ProgramMembers2.png";
import programMember3 from "@/assets/angelaharris/ProgramMembers3.png";
import programMember4 from "@/assets/angelaharris/ProgramMembers4.png";
import programMember5 from "@/assets/angelaharris/ProgramMembers5.png";
import programMember6 from "@/assets/angelaharris/ProgramMembers6.png";

const ProgramMembers: React.FC = () => {
  // Replace these paths with your actual PNG file names
  const logos = [
    { id: 1, src: programMember1, alt: "Insider Exposure" },
    { id: 2, src: programMember2, alt: "GA Elite Showcase" },
    { id: 3, src: programMember3, alt: "Court Vision" },
    {
      id: 4,
      src: programMember4,
      alt: "Britt Basketball Academy",
    },
    { id: 5, src: programMember5, alt: "Finest Basketball Club" },
    {
      id: 6,
      src: programMember6,
      alt: "Britt Basketball Academy Girls",
    },
  ];

  return (
    <section className="bg-[#00863A] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <h2 className="text-white text-center text-sm md:text-base font-medium mb-12 tracking-wide">
          Network Program Members
        </h2>

        {/* Logos Grid/Flex */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {logos.map((logo) => (
            <div
              key={logo.id}
              className="w-32 h-24 md:w-40 md:h-28 flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramMembers;
