import React from "react";
import gridPattern from "@/assets/angelaharris/Background pattern.png";

const ContactHero: React.FC = () => {
  return (
    <section className="relative w-full py-24 px-6 bg-white overflow-hidden flex items-center justify-center">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-60"
        style={{
          backgroundImage: `url(${gridPattern})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Green gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-[#F4FAF6] to-transparent z-0" />

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#F4FAF6] border border-emerald-100 px-5 py-2 rounded-full mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#11D000] animate-pulse" />
          <span className="text-sm font-semibold bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] bg-clip-text text-transparent uppercase tracking-widest">
            Get In Touch
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A202C] leading-tight mb-6">
          We're Here to{" "}
          <span className="bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] bg-clip-text text-transparent">
            Help
          </span>
        </h1>

        <p className="text-[#6C7787] text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Have questions about Highlightz? Whether you're an athlete, parent, or
          coach — our team is ready to support your recruiting journey.
        </p>
      </div>
    </section>
  );
};

export default ContactHero;
