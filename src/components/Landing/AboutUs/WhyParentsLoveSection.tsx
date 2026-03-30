import React from "react";
import {
  Map,
  User,
  Share2,
  BookOpen,
  ClipboardList,
  Target,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className="bg-[#DDF2E6] rounded-4xl p-8 flex flex-col h-full">
      {/* Icon and Title Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-white/50 rounded-full flex items-center justify-center shrink-0">
          <div className="text-[#00813B]">{icon}</div>
        </div>
        <h3 className="text-lg font-bold text-[#1A202C] leading-tight">
          {title}
        </h3>
      </div>

      {/* Description Text */}
      <p className="text-[#4A5568] text-[13px] leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const WhyParentsLoveSection: React.FC = () => {
  const features = [
    {
      icon: <Map size={20} />,
      title: "A Clear Recruiting Roadmap",
      description:
        "Most parents don’t know when recruiting actually starts or what they should be doing each year. Highlightz provides a grade-by-grade recruiting roadmap from 7th-12th grade so parents always know the next step.",
    },
    {
      icon: <User size={20} />,
      title: "A Professional Athlete Profile",
      description:
        "Athletes can build a recruiting-ready profile with highlights, stats, academics, and achievements that can be shared with college coaches.",
    },
    {
      icon: <Share2 size={20} />,
      title: "Simple Highlight Sharing",
      description:
        "Instead of sending clips through text or social media, athletes can share one clean recruiting link that shows their profile and highlight reels.",
    },
    {
      icon: <BookOpen size={20} />,
      title: "Parent Education",
      description:
        "Through the Highlightz Parent Education, families learn how recruiting works, when coaches evaluate athletes, and how to communicate with college programs.",
    },
    {
      icon: <ClipboardList size={20} />,
      title: "Tools Built for Recruiting",
      description:
        "Highlightz includes tools that help families prepare for the process like coach email templates, visit preparation questions, offer comparison tools, and recruiting checklists.",
    },
    {
      icon: <Target size={20} />,
      title: "Opportunity: Exposure Meets Strategy",
      description:
        "The outcome pillar where visibility, strategy, and execution come together. Highlightz combines professional profiles with a clear roadmap and powerful tools to deliver more exposure and better recruiting outcomes for your athlete.",
    },
  ];

  return (
    <section className="bg-white py-24 px-6 md:px-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading Section */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A202C]">
            Why Parents Love Highlightz
          </h2>
          <p className="text-[#4A5568] text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            Parents want two things in the recruiting process: Clarity and
            opportunity for their athlete. Highlightz was designed to provide
            both.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
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

export default WhyParentsLoveSection;
