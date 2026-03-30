import React from "react";
import icon from "@/assets/angelaharris/check-circle-broken.png";

interface StepProps {
  number: string;
  title: string;
  description: string;
  listItems: string[];
}

const StepCard: React.FC<StepProps> = ({
  number,
  title,
  description,
  listItems,
}) => {
  return (
    <div className="bg-white rounded-4xl p-8 md:p-10 shadow-sm relative overflow-hidden flex flex-col h-full border border-gray-100">
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-[#12141D] mb-4 leading-tight">
          {title}
        </h3>
        <p className="text-[#475569] text-sm leading-relaxed mb-6">
          {description}
        </p>

        <ul className="space-y-3">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <img src={icon} alt="icon" className="w-6 h-6" />
              <span className="text-gray-600 text-sm">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Large Background Number */}
      <span className="absolute bottom-2 right-6 text-[120px] font-bold text-[#E2E8F0] select-none leading-none z-0">
        {number}
      </span>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: "1",
      title: "Build Your Athlete Profile",
      description:
        "Create a professional athlete profile with highlights, stats, academic info, and measurable attributes. This becomes the athlete's digital recruiting resume.",
      listItems: [
        "Highlights and clips",
        "Stats and achievements",
        "Academic information",
        "Measurable attributes",
      ],
    },
    {
      number: "2",
      title: "Create and Share Your Highlight Reel",
      description:
        "Upload clips and organize them into highlight reels. Each athlete receives a shareable recruiting link that can be sent directly to college coaches.",
      listItems: [
        "Upload clips",
        "Shareable recruiting link",
        "Everything in one place",
      ],
    },
    {
      number: "3",
      title: "Follow the Recruiting Roadmap",
      description:
        "Highlightz guides Parents through the recruiting journey with grade-by-grade plans and parent education through Parent Education.",
      listItems: [
        "Grade-by-grade plans",
        "Parent Education",
        "Coach contact tools",
        "Progress tracking",
      ],
    },
  ];

  return (
    <section className="bg-[#F5FCF6] py-20 px-6 font-sans" id="how-it-works">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#181D27] mb-4">
            How Highlightz Works
          </h2>
          <p className="text-[#6C7787] max-w-2xl mx-auto">
            A simple, three-step system designed to help athletes maximize their
            opportunities.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>

        {/* The Result Banner */}
        <div className="container mx-auto">
          <div className="bg-[#E6F6ED] rounded-3xl p-10 md:p-14 text-center border-x-[6px]  border-[#007E37]">
            <h3 className="text-2xl md:text-3xl font-semibold text-[#003B1A] mb-6">
              The Result
            </h3>
            <p className="text-[#00331A] text-sm md:text-base leading-relaxed max-w-4xl mx-auto font-medium">
              Athletes become recruiting-ready earlier, and Parents navigate the
              process with confidence instead of confusion.{" "}
              <span className="bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] bg-clip-text text-transparent font-semibold">
                That's the power of Highlightz.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
