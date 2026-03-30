import React from "react";
import gridPattern from "@/assets/angelaharris/Background pattern.png";
import appPhoto from "@/assets/angelaharris/Content.png";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden flex items-center pt-20 lg:pt-0 px-6">
      {/* 1. Background Grid Pattern Image */}
      <div
        className="absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: `url(${gridPattern})`, // Fixed here
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A202C] leading-[1.15] mb-6">
              The Recruiting Platform That Showcases Athletes and Educates
              Parents
            </h1>
            <p className="text-gray-500 text-lg md:text-xl font-medium mb-12">
              Parents create your athlete's profile
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={"/signup"}
                className="bg-green-600 py-3 text-center font-semibold hover:bg-green-700 disabled:bg-green-700 text-white px-7 rounded-full bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer"
              >
                Create Your Athlete Profile
              </Link>

              <Link
                to={"/#how-it-works"}
                className="py-3 px-7 rounded-full border border-green-700 bg-white text-[#0C5302] font-semibold text-center shadow-md transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl cursor-pointer"
              >
                <span className="bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] bg-clip-text text-transparent">
                  Watch How It Works
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative z-10 w-full max-w-[320px] md:max-w-112.5">
              <img
                src={appPhoto}
                alt="Highlightz App Mockup"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
