import React from "react";
import { Users, Video, Link2 } from "lucide-react";
import RecruitingSection1 from "@/assets/angelaharris/RecruitingSection1.jpg";
import RecruitingSection2 from "@/assets/angelaharris/RecruitingSection2.jpg";
import RecruitingSection3 from "@/assets/angelaharris/RecruitingSection3.jpg";

interface FeatureCardProps {
  image: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-white rounded-4xl shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col border border-gray-100 transition-transform duration-300 hover:-translate-y-2">
      {/* Top Image Section */}
      <div className="">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover rounded-3xl"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 pt-4">
        <div className="flex items-center gap-3 mb-4">
          {/* Icon Circle */}
          <div className="w-10 h-10 rounded-full bg-[#E9F7EF] flex items-center justify-center text-[#2D8A56]">
            {icon}
          </div>
          <h3 className="text-2xl font-semibold text-[#323C4B]">{title}</h3>
        </div>

        <p className="text-[#6C7787] text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const RecruitingSection: React.FC = () => {
  const features = [
    {
      image: RecruitingSection1, // Volleyball image
      icon: <Users size={20} />,
      title: "Confusing Process",
      description:
        "Parents don't know when recruiting starts or what the next steps are.",
    },
    {
      image: RecruitingSection2, // Soccer image
      icon: <Video size={20} />,
      title: "Highlights Scattered",
      description:
        "Videos are spread across YouTube, phones, and Instagram, making them hard to find.",
    },
    {
      image: RecruitingSection3, // Baseball image
      icon: <Link2 size={20} />,
      title: "Coaches Need One Link",
      description:
        "College coaches want fast, organized access to everything in one place.",
    },
  ];

  return (
    <section className="bg-white py-20 px-6 font-sans">
      <div className="container mx-auto">
        {/* Main Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#181D27] mb-16  leading-tight">
          Most Athletes Miss Recruiting Opportunities Because They Aren't
          Organized
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              image={feature.image}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecruitingSection;
