import React from "react";
import { Link } from "react-router-dom";
import ctaAbout from "@/assets/angelaharris/ctaAbout.jpg";

const ContactCTA: React.FC = () => {
  return (
    <section className="bg-[#FAF9F6] py-12 px-6">
      <div className="container mx-auto relative rounded-[3rem] overflow-hidden min-h-80 flex items-center justify-center text-center shadow-2xl">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={ctaAbout}
            alt="Athletes on field"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 flex flex-col items-center py-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight">
            Ready to Start Your <br className="hidden md:block" />
            Recruiting Journey?
          </h2>
          <p className="text-white/85 text-base md:text-lg max-w-xl mb-10 font-medium">
            Join thousands of athletes and parents already using Highlightz to
            take control of their future.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/signup"
              className="bg-linear-to-b from-[#32CD32] to-[#006400] text-white font-bold py-4 px-10 rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
            >
              Create Your Profile Now
            </Link>
            <Link
              to="/about-us"
              className="border border-white/60 text-white font-bold py-4 px-10 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
