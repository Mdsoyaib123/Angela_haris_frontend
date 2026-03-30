import React from "react";
import { Users, FileText, Link } from "lucide-react";

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="bg-[#F8FDF9] p-8 rounded-3xl border border-emerald-50 shadow-sm hover:shadow-md transition-shadow text-left">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 bg-[#E6F6ED] rounded-full flex items-center justify-center text-[#007E37]">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-[#323C4B]">{title}</h3>
    </div>
    <p className="text-[#6C7787] text-sm leading-relaxed">{description}</p>
  </div>
);

const NetworkBenefits: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="container mx-auto text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#181D27] mb-4">
            Highlightz Network Member Benefits
          </h2>
          <p className="text-[#667085] mb-16 max-w-2xl mx-auto">
            We provide the infrastructure so you can focus on development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitCard
            icon={<Users className="w-6 h-6" />}
            title="Expand Your Reach"
            description="Connect with a global network of athletes, parents, and college coaches looking for elite talent."
          />
          <BenefitCard
            icon={<FileText className="w-6 h-6" />}
            title="Elite Resources"
            description="Get access to exclusive recruiting tools, educational content, and professional athlete profile templates."
          />
          <BenefitCard
            icon={<Link className="w-6 h-6" />}
            title="Community Growth"
            description="Join a community of forward-thinking sports professionals dedicated to athlete success."
          />
        </div>
      </div>
    </section>
  );
};

export default NetworkBenefits;
