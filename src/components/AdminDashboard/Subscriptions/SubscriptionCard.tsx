import { useGetDashboardStatsQuery } from "@/redux/features/dashboard-stats/dashboardStatsApi";

export default function SubscriptionCard() {
  const { data, isLoading } = useGetDashboardStatsQuery();
  const { free, pro, elite } = data?.data.stats || {};
  const tiers = [
    {
      name: "Free Tier",
      number: free || "0",
      description: "Non-revenue users",
      bgColor: "bg-[#FFFFFF] border border-[#E2E8F0]",
      badgeBgColor: "bg-[#EFEEEE]",
      textColor: "text-[#475569]",
    },
    {
      name: "Pro Tier",
      number: pro || "0",
      description: "$9.99/mo plan",
      bgColor: "bg-[#EBF9FF] border border-[#E2E8F0]",
      badgeBgColor: "bg-[#D2EDF9]",
      textColor: "text-[#429AFE]",
    },
    {
      name: "Elite Tier",
      number: elite || "0",
      description: "$99/yr plan",
      bgColor: "bg-[#ECEBFF] border border-[#E2E8F0]",
      badgeBgColor: "bg-[#D5D2FF]",
      textColor: "text-[#7A42FE]",
    },
  ];
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 gap-4 w-full mb-6">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className={`${tier.bgColor} rounded-lg p-6 flex flex-col`}
          >
            <h3 className="text-xl font-medium text-[#1D2028] mb-4">
              {tier.name}
            </h3>

            {isLoading ? (
              <div className="flex items-center h-12 mb-4">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <p className="text-4xl font-medium text-[#0F1325] mb-4">
                {tier.number}
              </p>
            )}

            <span
              className={`w-fit px-3 py-2 rounded-md ${tier.badgeBgColor} ${tier.textColor} text-sm font-medium`}
            >
              {tier.description}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
