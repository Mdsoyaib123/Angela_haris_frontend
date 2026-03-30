import React from "react";
import check from "@/assets/angelaharris/check-circle-broken.png";

interface BenefitCardProps {
  title: string;
  subtitle?: string;
  body?: string;
  listItems?: string[];
  extraBody?: string;
  footer: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  title,
  subtitle,
  body,
  listItems,
  extraBody,
  footer,
}) => {
  return (
    <div
      // Changed 'border' to 'border-x' for left/right only
      className="bg-white border-x-2 border-[#A7D5B8] rounded-4xl p-8 flex flex-col justify-between h-full shadow-md"
    >
      {/* Header Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#1A202C] leading-tight mb-4">
          {title}
        </h3>
        <p className="text-lg font-semibold text-[#2D3748] mb-4 leading-snug">
          {subtitle}
        </p>
        {body && (
          <p className="text-[#4A5568] text-[0.9rem] leading-relaxed">{body}</p>
        )}

        {listItems && (
          <ul className="space-y-3 my-4">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <img src={check} alt="icon" className="w-5 h-5" />
                <span className="text-[#4A5568] text-[0.9rem]">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {extraBody && (
          <p className="text-[#1A202C] text-lg font-semibold leading-relaxed pt-2">
            {extraBody}
          </p>
        )}
      </div>

      {/* Footer Summary Section */}
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

        <p className="text-[#1A202C] text-base font-semibold leading-snug">
          {footer}
        </p>
      </div>
    </div>
  );
};

const WhyParentsLove: React.FC = () => {
  const benefits: BenefitCardProps[] = [
    {
      title: "They Finally Understand the Recruiting Process",
      subtitle: "No more guessing or Googling at midnight.",
      body: "Highlightz gives parents a clear, step-by-step roadmap from 7th—12th grade so they always know what's coming next.",
      footer: "Confidence replaces confusion.",
    },
    {
      title: "Their Athlete Looks Professional",
      subtitle: "First impressions matter with college coaches.",
      body: "Highlightz creates a polished, all-in-one athlete profile with highlights, stats, academics, and achievements.",
      footer: "Their child stands out instantly.",
    },
    {
      title: "Everything Is in One Place",
      body: "No more juggling:",
      listItems: ["Text messages", "Hudl links", "Random clips", "Emails"],
      extraBody: "With Highlightz, it's one clean link that shows everything.",
      footer: "Simple, organized, stress-free.",
    },
    {
      title: "They Know What Coaches Are Actually Looking For",
      subtitle: "Most parents don't know:",
      listItems: [
        "When coaches start watching",
        "What matters most",
        "How decisions are made",
      ],
      extraBody: "Highlightz teaches all of it.",
      footer: "They stop guessing and start moving strategically.",
    },
    {
      title: "They Feel Prepared (Not Overwhelmed)",
      subtitle: "Highlightz doesn't just inform — it equips.",
      body: "From emails to visits to offers—Highlightz gives parents real tools they can actually use, like:",
      listItems: [
        "Coach email templates",
        "Visit question guides",
        "Offer comparison tools",
      ],
      footer: "They walk into every step ready.",
    },
    {
      title: "It Creates Real Opportunities for Their Athlete",
      subtitle: "At the end of the day, this is what matters most.",
      body: "Highlightz helps athletes:",
      listItems: ["Get seen", "Get evaluated", "Get recruited"],
      footer:
        "Parents feel like they're finally giving their child a real shot at the next level.",
    },
  ];

  return (
    <section className="bg-[#FAFBFD] py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-[#1A202C] mb-16">
          Why Parents Love Highlightz
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyParentsLove;
