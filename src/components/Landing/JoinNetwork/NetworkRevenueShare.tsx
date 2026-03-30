import React from "react";
import ctaBg from "@/assets/angelaharris/network-cta-bg.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NetworkRevenueShare: React.FC = () => {
  return (
    <section className="relative container mx-auto md:h-140 min-h-120 py-12 md:py-0 flex items-center justify-center overflow-hidden my-12 md:rounded-[2.5rem] rounded-xl px-4">
      {/* Background with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${ctaBg})` }}
      >
        <div className="absolute inset-0 bg-black/70 z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 text-white text-center w-full md:max-w-162.5">
        <h2 className="text-3xl md:text-5xl font-semibold mb-6">
          Revenue Share Program
        </h2>
        <p className="text-lg md:w-[95%] mx-auto mb-10 leading-relaxed">
          Our members earn a percentage of every subscription generated through
          their network. It's a win-win: your athletes get elite tools, and your
          organization grows.
        </p>
        <Button
          asChild
          className="bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] text-white px-6 sm:px-10 py-6 w-full sm:w-fit mx-auto rounded-full text-sm sm:text-base font-semibold hover:brightness-110 transition-all shadow-lg cursor-pointer border-none uppercase md:tracking-wider"
        >
          <Link to="/signup"> Membership for Organizations</Link>
        </Button>
      </div>
    </section>
  );
};

export default NetworkRevenueShare;
