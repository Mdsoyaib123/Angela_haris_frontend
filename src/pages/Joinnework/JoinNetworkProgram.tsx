import NetworkHero from "@/components/Landing/JoinNetwork/NetworkHero";
import NetworkBenefits from "@/components/Landing/JoinNetwork/NetworkBenefits";
import NetworkRevenueShare from "@/components/Landing/JoinNetwork/NetworkRevenueShare";
import NetworkApplication from "@/components/Landing/JoinNetwork/NetworkApplication";
import NetworkFooterBanner from "@/components/Landing/JoinNetwork/NetworkFooterBanner";
import ProgramMembers from "@/components/Landing/Landing/ProgramMembers";

export default function JoinNetworkProgram() {
  return (
    <div className="bg-white">
      <NetworkHero />
      <ProgramMembers />
      <NetworkBenefits />
      <NetworkRevenueShare />
      <NetworkApplication />
      <NetworkFooterBanner />
    </div>
  );
}
