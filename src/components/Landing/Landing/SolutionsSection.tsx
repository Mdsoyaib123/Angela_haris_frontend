import React from "react";
import { Smartphone, Video, GraduationCap } from "lucide-react";

interface SolutionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const SolutionCard: React.FC<SolutionCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-[#D7F2E2] rounded-3xl p-8 flex flex-col h-full transition-transform duration-300 hover:-translate-y-2">
      {/* Icon and Title Row */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center shadow-md">
          <div className="text-[#00813B]">{icon}</div>
        </div>
        <h3 className="text-2xl font-semibold text-[#323C4B]">{title}</h3>
      </div>

      {/* Description */}
      <p className="text-[#414D60] text-[0.95rem] leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const SolutionsSection: React.FC = () => {
  const solutions = [
    {
      icon: <Smartphone size={22} fill="currentColor" />,
      title: "Athlete Profile",
      description: "A professional recruiting page that showcases your talent.",
    },
    {
      icon: <Video size={22} fill="currentColor" />,
      title: "Highlight Reels",
      description: "Organize your clips instantly into a coach-ready reel.",
    },
    {
      icon: <GraduationCap size={22} fill="currentColor" />,
      title: "Recruiting Education",
      description: "Parents learn the process with a clear roadmap.",
    },
  ];

  return (
    <section className="bg-white py-20 px-6 font-sans">
      <div className="container mx-auto">
        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#181D27] mb-16">
          Highlightz Solves All Three Problems
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((item, index) => (
            <SolutionCard
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
