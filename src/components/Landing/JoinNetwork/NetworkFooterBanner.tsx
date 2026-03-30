import React from "react";

const NetworkFooterBanner: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-[#F5FCF6] text-center border-t border-gray-50">
      <div className="mx-auto container">
        <h2 className="text-3xl md:text-4xl font-semibold text-[#181D27] mb-6">
          Start earning revenue while helping athletes get recruited.
        </h2>
        <p className="text-[#475467] text-lg max-w-full overflow-hidden">
          Email{" "}
          <a
            href="mailto:networkprogram@highlightzapp.com"
            className="text-emerald-600 font-semibold leading-relaxed hover:underline break-all sm:break-normal"
          >
            networkprogram@highlightzapp.com
          </a>{" "}
          to Join the Network
        </p>
      </div>
    </section>
  );
};

export default NetworkFooterBanner;
