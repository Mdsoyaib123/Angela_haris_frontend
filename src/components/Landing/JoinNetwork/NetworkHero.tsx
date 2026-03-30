import React from "react";
import heroBg from "@/assets/angelaharris/footkick.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NetworkHero: React.FC = () => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 md:hidden bg-black/5 bg-blend-overlay backdrop-blur-xs z-10"></div>
      <div className="w-full h-[500px] md:h-[708px]">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="absolute z-20 inset-0 flex flex-col items-start justify-center text-left px-4">
        <div className="container w-full mx-auto text-left">
          {" "}
          <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6 leading-tight">
            Join the Highlightz <br /> Network Program
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
            The official partnership program for organizations. Empower your
            athletes, educate Parents, and grow your revenue.
          </p>
          <Button className="bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] text-white px-8 md:py-7 py-6 rounded-full text-lg font-semibold hover:brightness-110 transition-all shadow-lg md:w-fit w-full cursor-pointer border-none">
            <Link to="/signup">Apply to Join</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NetworkHero;
