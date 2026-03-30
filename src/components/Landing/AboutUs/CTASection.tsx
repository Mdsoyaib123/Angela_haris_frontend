import React from "react";
import ctaAbout from "@/assets/angelaharris/ctaAbout.jpg";
import { Link } from "react-router-dom";

const CTASection: React.FC = () => {
  return (
    <section className="bg-[#FAF9F6] py-12 px-6">
      <div className="container mx-auto relative rounded-[3rem] overflow-hidden min-h-125 flex items-center justify-center text-center shadow-2xl">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={ctaAbout}
            alt="Athlete starting line"
            className="w-full h-full object-cover"
          />
          {/* Black gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 px-4 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
            Ready to start your <br className="hidden md:block" /> journey?
          </h2>

          <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-12 font-medium">
            Join thousands of athletes and parents who are taking control of
            their recruiting future today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary Gradient Button */}
            <Link
              to={"/signup"}
              className="bg-linear-to-b from-[#32CD32] to-[#006400] text-white font-bold py-4 px-10 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
            >
              Create Your Profile Now
            </Link>

            {/* Secondary Outline Button */}
            <button className="border border-white/60 text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 transition-colors duration-200">
              View Sample Profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
