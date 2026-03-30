import React from "react";
import check from "@/assets/angelaharris/check-circle-broken.png";
import { IoIosBookmarks } from "react-icons/io";
import { PiClipboardTextFill, PiTargetBold } from "react-icons/pi";
import { IoMap, IoShareSocial } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  intro: string;
  listLabel?: string;
  listItems: string[];
  footer: string;
}

const WhyChooseCard: React.FC<CardProps> = ({
  icon,
  title,
  subtitle,
  intro,
  listLabel,
  listItems,
  footer,
}) => {
  return (
    <div className="bg-[#DDF2E6] rounded-3xl p-8 flex flex-col justify-between h-full shadow-sm">
      {/* Body Section */}
      <div className="grow space-y-4">
        {/* Header Section */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center shrink-0">
            <div className="text-[#00813B]">{icon}</div>
          </div>
          <h3 className="text-xl font-semibold text-[#323C4B] leading-tight">
            {title}
          </h3>
        </div>
        <h4 className="text-lg font-semibold text-[#323C4B] leading-snug">
          {subtitle}
        </h4>
        <p className="text-[#414D60] text-base font-medium leading-relaxed">
          {intro}
        </p>

        {listLabel && (
          <p className="text-[#414D60] text-base font-medium pt-2">
            {listLabel}
          </p>
        )}

        <ul className="space-y-3 my-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start text-sm gap-3">
              <img src={check} alt="icon" className="w-5 h-5" />
              <span className="text-[#4A5568] text-base leading-tight">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Section */}
      <div className="mt-10 flex items-center gap-3">
        <div className="shrink-0">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10.5119 4.43057C10.1974 4.70014 10.161 5.17361 10.4306 5.48811L16.0122 12L10.4306 18.5119C10.161 18.8264 10.1974 19.2999 10.5119 19.5695C10.8264 19.839 11.2999 19.8026 11.5694 19.4881L17.5694 12.4881C17.8102 12.2072 17.8102 11.7928 17.5694 11.5119L11.5694 4.51192C11.2999 4.19743 10.8264 4.161 10.5119 4.43057Z"
              fill="#007E37"
            />
            <path
              d="M6.25 5.00005C6.25 4.68619 6.44543 4.40553 6.73979 4.29664C7.03415 4.18774 7.36519 4.27366 7.56944 4.51196L13.5694 11.512C13.8102 11.7928 13.8102 12.2073 13.5694 12.4881L7.56944 19.4881C7.36519 19.7264 7.03415 19.8124 6.73979 19.7035C6.44543 19.5946 6.25 19.3139 6.25 19L6.25 5.00005Z"
              fill="#007E37"
            />
          </svg>
        </div>

        <p className="text-[#323C4B] text-base font-semibold leading-snug">
          {footer}
        </p>
      </div>
    </div>
  );
};

const WhyChooseSection: React.FC = () => {
  const data: CardProps[] = [
    {
      icon: <IoMap size={24} />,
      title: "Clarity: The Recruiting Roadmap",
      subtitle: "Highlightz removes the guesswork.",
      intro:
        "Parents and athletes get a grade-by-grade roadmap (7th—12th) so they always know:",
      listItems: ["What to do", "When to do it", "Why it matters"],
      footer: "No more confusion. No missed opportunities.",
    },
    {
      icon: <FaUser size={24} />,
      title: "Visibility: The Athlete Profile",
      subtitle:
        "Every athlete gets a professional, recruiter-ready digital presence.",
      intro: "",
      listLabel: "Includes:",
      listItems: ["Highlights", "Stats", "Academics", "Achievements"],
      footer: "It's not just a profile — it's a personal recruiting brand.",
    },
    {
      icon: <IoShareSocial size={24} />,
      title: "Simplicity: One Link Recruiting",
      subtitle:
        "No more sending clips through text, DMs, or scattered platforms.",
      intro: "Athletes share one clean link that shows:",
      listItems: ["Full profile", "Highlight reels", "Key info coaches need"],
      footer: "Simple for families. Seamless for coaches.",
    },
    {
      icon: <IoIosBookmarks size={24} />,
      title: "Education: Parent Education",
      subtitle:
        "Most families don't understand recruiting - and that's the biggest disadvantage.",
      intro: "Highlightz teaches:",
      listItems: [
        "How recruiting actually works",
        "When coaches are evaluating",
        "How to communicate with programs",
      ],
      footer: "Educated parents = better decisions = more opportunities.",
    },
    {
      icon: <PiClipboardTextFill size={24} />,
      title: "Preparation: Recruiting Tools Suite",
      subtitle: "Highlightz doesn't just inform — it equips.",
      intro: "Built-in tools include:",
      listItems: [
        "Coach email templates",
        "Visit preparation questions",
        "Offer comparison worksheets",
        "Recruiting checklists",
      ],
      footer: "Families show up prepared, confident, and organized.",
    },
    {
      icon: <PiTargetBold size={24} />,
      title: "Opportunity: Exposure Meets Strategy",
      subtitle: "This is the outcome pillar — where everything comes together.",
      intro: "Highlightz combines:",
      listItems: [
        "Visibility profile + highlights",
        "Strategy (roadmap + education)",
        "Execution (tools)",
      ],
      footer:
        "Result: More exposure. Better opportunities. Smarter recruiting outcomes.",
    },
  ];

  return (
    <section className="bg-white py-24 px-6 md:px-12 font-sans">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A202C]">
            Why Choose Highlightz
          </h2>
          <p className="text-[#4A5568] text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            Parents want two things in the recruiting process: Clarity and
            opportunity for their athlete. Highlightz was designed to provide
            both.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((card, index) => (
            <WhyChooseCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
