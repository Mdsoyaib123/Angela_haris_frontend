import React from "react";
import { IoTennisballSharp } from "react-icons/io5";
import { RiHome4Fill, RiUserHeartFill } from "react-icons/ri";
import { FaMedal, FaVideo } from "react-icons/fa";
import { HiAcademicCap, HiUsers } from "react-icons/hi2";

interface VisionItem {
  icon: React.ReactNode;
  label: string;
}

const VisionSection: React.FC = () => {
  const topRow: VisionItem[] = [
    { icon: <IoTennisballSharp size={20} />, label: "Athletes" },
    { icon: <RiUserHeartFill size={20} />, label: "Parents" },
    { icon: <FaVideo size={20} />, label: "Videographers" },
    { icon: <FaMedal size={20} />, label: "Tournaments" },
    { icon: <RiHome4Fill size={20} />, label: "Clubs" },
  ];

  const bottomRow: VisionItem[] = [
    { icon: <HiAcademicCap size={20} />, label: "Schools" },
    { icon: <HiUsers size={20} />, label: "College Coaches" },
  ];

  return (
    <section className="bg-white py-24 px-6 font-sans">
      <div className="container mx-auto text-center">
        {/* Heading Section */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A202C] mb-6">
            The Vision for Highlightz
          </h2>
          <p className="text-[#4A5568] text-sm md:text-base max-w-2xl mx-auto leading-relaxed opacity-80">
            Highlightz isn't just another recruiting tool. It's building the
            modern recruiting ecosystem for youth sports, connecting the entire
            community.
          </p>
        </div>

        {/* Icon Grid Section */}
        <div className="flex flex-col gap-6 items-center mb-16">
          {/* Top Row - 5 items */}
          <div className="flex flex-wrap justify-center gap-4">
            {topRow.map((item, idx) => (
              <VisionCard key={idx} icon={item.icon} label={item.label} />
            ))}
          </div>

          {/* Bottom Row - 2 items centered */}
          <div className="flex flex-wrap justify-center gap-4">
            {bottomRow.map((item, idx) => (
              <VisionCard key={idx} icon={item.icon} label={item.label} />
            ))}
          </div>
        </div>

        {/* Bottom Statement Section */}
        <div className="space-y-4">
          <p className="bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] bg-clip-text text-transparent font-semibold text-2xl">
            The standard recruiting companion for every athlete starting in
            middle school.
          </p>
          <p className="text-[#4A5568] text-sm md:text-lg italic opacity-70">
            Because every athlete deserves the chance to be seen.
          </p>
        </div>
      </div>
    </section>
  );
};

// Sub-component for the individual category cards
const VisionCard: React.FC<VisionItem> = ({ icon, label }) => (
  <div className="bg-[#F5FCF6] w-48 md:w-52 py-6 rounded-2xl shadow-md border border-emerald-50/50 flex flex-col items-center gap-3 transition-transform hover:scale-105 duration-200 cursor-default">
    <div className="w-12 h-12 bg-[#F5FCF6] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,130,0,0.3)]">
      <div className="text-[#00813B]">{icon}</div>
    </div>
    <span className="text-[#1A202C] text-[11px] md:text-xs font-bold uppercase tracking-wide">
      {label}
    </span>
  </div>
);

export default VisionSection;
