import React from "react";

const Testimonial: React.FC = () => {
  return (
    <section className="bg-white py-20 px-6 font-sans">
      <div className="container mx-auto">
        {/* Card Container */}
        <div className="bg-[#F4FAF6] rounded-[2.5rem] p-10 md:p-20 text-center shadow-sm">
          {/* Top Category Tag */}
          {/* <span className="bg-[linear-gradient(180deg,#11D000_0%,#0C5302_100%)] bg-clip-text text-transparent text-[14px] font-bold uppercase tracking-[0.2em] block mb-8">
              Financial Services
            </span> */}

          {/* Main Testimonial Text */}
          <blockquote className="text-2xl md:text-[32px] font-bold text-[#181D27] leading-tight  mb-12">
            "I absolutely love Highlightz because as a parent it gives me a
            sense of ownership in my student recruiting process. Highlightz
            gives me the option to upload my son videos but also the parent
            recruiting guide is a next level addition to this platform"
          </blockquote>

          {/* Author Section */}
          <div className="flex flex-col items-center">
            {/* Avatar */}
            {/* <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-white shadow-md">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                alt="Derrick Tw"
                className="w-full h-full object-cover"
              />
            </div> */}
            {/* Name and Title */}
            <cite className="not-italic text-[#1A202C] text-base font-semibold tracking-tight">
              Derrick T, Parent
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
