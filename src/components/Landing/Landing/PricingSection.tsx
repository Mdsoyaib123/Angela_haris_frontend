import React, { useState } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState(true); // default to yearly

  const starterFeatures = [
    "Build shareable athlete profiles",
    "Upload up to 3 video clips",
    "Create one highlight reel",
    "Unlimited Storage",
    "The Parent's Guide to College Recruiting",
  ];

  const proFeatures = [
    "Everything in Starter",
    "Upload up to 6 video clips",
    "One active profile link",
    "One-click coach sharing",
    "Analytics dashboard",
    "Track Recruiting Progress",
  ];

  const eliteFeatures = [
    "Everything in Starter",
    "Upload up to 6 video clips",
    "One active profile link",
    "One-click coach sharing",
    "Analytics dashboard",
    "Track Recruiting Progress",
  ];

  // Choose features based on toggle
  const currentFeatures = isYearly ? eliteFeatures : proFeatures;

  return (
    <section className="bg-white py-24 px-6 md:px-12 font-sans" id="pricing">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr_1fr] gap-x-8 gap-y-12 items-start">
        {/* Column 1: Title Section */}
        <div className="lg:pt-4">
          <h2 className="text-4xl font-semibold text-[#181D27] leading-tight text-center lg:text-left">
            Simple Pricing
          </h2>
        </div>

        {/* Column 2: Starter Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 hover:shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col h-full transition-all duration-300">
          <div className="text-center mb-8">
            <h3 className="text-5xl font-semibold text-[#181D27] my-6">Free</h3>
            <p className="text-gray-900 font-semibold tracking-wide text-lg">
              Starter Tier
            </p>
          </div>

          <ul className="space-y-4 mb-12 grow">
            {starterFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#10B981]" strokeWidth={4} />
                </div>
                <span className="text-[#535862] text-sm leading-snug">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <Link
            to="/signup"
            className="w-full py-3 px-7 rounded-full border border-green-700 bg-white text-[#0C5302] font-semibold text-center shadow-md transition-all duration-300 ease-out cursor-pointer"
          >
            <span className="bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] bg-clip-text text-transparent">
              Start My Profile
            </span>
          </Link>
        </div>

        {/* Column 3: Pro/Elite Card with Toggle */}
        <div className="bg-[#F4FAF6] rounded-[2.5rem] p-8 md:p-10 hover:shadow-xl shadow-gray-200/40 border border-emerald-50 relative flex flex-col h-full transition-all duration-300">
          {/* Badge changes based on toggle */}
          <div className="absolute top-4 right-5 md:top-6 md:right-8 bg-green-600 px-5 py-1.5 text-center font-semibold text-white rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md">
            {isYearly ? "Elite Plan" : "Pro Plan"}
          </div>

          <div className="flex flex-col items-center mb-8">
            {/* Price display */}
            <div className="flex flex-col items-center my-6">
              {isYearly ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-semibold text-[#1E242C]">
                    $99
                  </span>
                  <span className="text-sm text-gray-500">/ year</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-semibold text-[#1E242C]">
                    $9.99
                  </span>
                  <span className="text-sm text-gray-500">/ month</span>
                </div>
              )}

              {/* Yearly savings badge */}
              {isYearly && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg line-through text-gray-400">
                    $119
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                </div>
              )}
            </div>

            {/* Monthly/Yearly Toggle */}
            <div className="flex items-center gap-4 mt-6">
              <span
                className={`text-xs font-bold ${!isYearly ? "text-[#1A202C]" : "text-gray-400"}`}
              >
                Monthly
              </span>

              <button
                onClick={() => setIsYearly(!isYearly)}
                className="h-3.5 w-8 bg-[#00A849]/30 rounded-full relative transition-colors duration-300 cursor-pointer focus:outline-none"
              >
                <div
                  className={`
                    absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-[#00A849] rounded-full shadow-md transition-transform duration-300 ease-in-out
                    ${isYearly ? "translate-x-4" : "-translate-x-1"}
                  `}
                />
              </button>

              <span
                className={`text-xs font-bold ${isYearly ? "text-[#1A202C]" : "text-gray-400"}`}
              >
                Yearly
              </span>
            </div>
          </div>

          <div className="w-full border-t border-gray-200/60 mb-8"></div>

          {/* <div className="w-full text-left mb-6">
            <p className="text-gray-900 font-bold uppercase tracking-wide text-xs">
              {isYearly ? "Elite Tier" : "Pro Tier"}
            </p>
          </div> */}

          <ul className="space-y-4 mb-12 grow">
            {currentFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1 shrink-0 w-5 h-5 rounded-full bg-[#D1FAE5] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#10B981]" strokeWidth={4} />
                </div>
                <span className="text-[#4A5568] text-sm leading-snug">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <div className="w-full border-t border-gray-200/60 mb-8"></div>

          <Link
            to="/signup"
            className="w-full bg-green-600 py-3 text-center font-semibold hover:bg-green-700 text-white px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
          >
            Start My Profile
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
