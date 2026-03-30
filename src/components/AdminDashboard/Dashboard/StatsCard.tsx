import { TrendingUp, Eye } from "lucide-react";
import { LuUserCheck } from "react-icons/lu";
import { MdVideoLibrary } from "react-icons/md";
import { useGetAdminDashboardStatsQuery } from "@/redux/features/admin/adminOverview/adminOverviewApi";

interface StatCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  label: string;
  value: string;
  valueColor: string;
  change: string;
  isLoading?: boolean;
}

function StatCard({
  icon,
  iconBgColor,
  label,
  value,
  valueColor,
  change,
  isLoading,
}: StatCardProps) {
  return (
    <div
      className="
    bg-white rounded-xl p-5 shadow-sm border border-gray-100
    transition-all duration-300 ease-out
    hover:shadow-md hover:-translate-y-0.5
    motion-safe:animate-fadeIn
    text-center sm:text-left
  "
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-6">
        <div
          className={`
        w-11 h-11 rounded-lg flex items-center justify-center
        transition-transform duration-300
        group-hover:scale-105
        ${iconBgColor}
      `}
        >
          {icon}
        </div>

        <span className="text-[#1D2028] text-sm font-medium">{label}</span>
      </div>

      {/* Value */}
      <div
        className="
      text-3xl font-semibold mb-6
      transition-colors duration-300
    "
      >
        {isLoading ? (
          <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mx-auto sm:mx-0"></div>
        ) : (
          value
        )}
      </div>

      {/* Change badge */}
      <div
        className={`
      flex items-center justify-center sm:justify-start gap-1
      px-3 py-1.5 w-fit mx-auto sm:mx-0
      rounded-md
      transition-all duration-300
      hover:brightness-105
      ${iconBgColor}
    `}
      >
        {isLoading ? (
          <div className="h-5 w-20 bg-gray-200 animate-pulse rounded"></div>
        ) : (
          <>
            <span className={`text-sm font-medium ${valueColor}`}>
              {change}%
            </span>
            <span className="text-gray-400 text-sm">vs last month</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function StatsCard() {
  const { data: stats, isLoading } = useGetAdminDashboardStatsQuery();

  console.log(stats, "usdsdsdsds: ");
  const statConfigs = [
    {
      icon: <TrendingUp className="w-7 h-7 text-emerald-500" />,
      iconBgColor: "bg-emerald-50",
      label: "Total Users",
      value: stats?.totalUsers.value || "0",
      valueColor: "text-emerald-500",
      change: stats?.totalUsers.change || "0",
    },
    {
      icon: <LuUserCheck className="w-7 h-7 text-[#429AFE]" />,
      iconBgColor: "bg-cyan-50",
      label: "Active Athletes",
      value: stats?.activeAthletes.value || "0",
      valueColor: "text-[#429AFE]",
      change: stats?.activeAthletes.change || "0",
    },
    {
      icon: <MdVideoLibrary className="w-7 h-7 text-violet-500" />,
      iconBgColor: "bg-violet-50",
      label: "Video Uploads",
      value: stats?.videoUploads.value || "0",
      valueColor: "text-violet-500",
      change: stats?.videoUploads.change || "0",
    },
    {
      icon: <Eye className="w-7 h-7 text-red-500" />,
      iconBgColor: "bg-red-50",
      label: "Total Views",
      value: stats?.totalViews.value || "0", // This might come from a different API if available
      valueColor: "text-red-500",
      change: stats?.totalViews.change || "0",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {statConfigs.map((stat) => (
        <StatCard key={stat.label} {...stat} isLoading={isLoading} />
      ))}
    </div>
  );
}

// import { TrendingUp, Eye, TriangleAlert } from "lucide-react";
// import { LuUserCheck } from "react-icons/lu";

// interface StatCardProps {
//   icon: React.ReactNode;
//   iconBgColor: string;
//   label: string;
//   value: string;
//   valueColor: string;
//   change: string;
// }

// const stats = [
//   {
//     icon: <TrendingUp className="w-7 h-7 text-emerald-500" />,
//     iconBgColor: "bg-emerald-50",
//     label: "Total Users",
//     value: "6",
//     valueColor: "text-emerald-500",
//     change: "+12",
//   },
//   {
//     icon: <LuUserCheck className="w-7 h-7 text-[#429AFE]" />,
//     iconBgColor: "bg-cyan-50",
//     label: "Active Athletes",
//     value: "4",
//     valueColor: "text-[#429AFE]",
//     change: "+5.2",
//   },
//   {
//     icon: <Eye className="w-7 h-7 text-violet-500" />,
//     iconBgColor: "bg-violet-50",
//     label: "MRR",
//     value: "$157",
//     valueColor: "text-violet-500",
//     change: "+2.4",
//   },
//   {
//     icon: <TriangleAlert className="w-7 h-7 text-red-500" />,
//     iconBgColor: "bg-red-50",
//     label: "Video Uploads",
//     value: "5",
//     valueColor: "text-red-500",
//     change: "-5.0",
//   },
// ];

// function StatCard({
//   icon,
//   iconBgColor,
//   label,
//   value,
//   valueColor,
//   change,
// }: StatCardProps) {
//   return (
//     <div
//       className="
//     bg-white rounded-xl p-5 shadow-sm border border-gray-100
//     transition-all duration-300 ease-out
//     hover:shadow-md hover:-translate-y-0.5
//     motion-safe:animate-fadeIn
//     text-center sm:text-left
//   "
//     >
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-6">
//         <div
//           className={`
//         w-11 h-11 rounded-lg flex items-center justify-center
//         transition-transform duration-300
//         group-hover:scale-105
//         ${iconBgColor}
//       `}
//         >
//           {icon}
//         </div>

//         <span className="text-[#1D2028] text-sm font-medium">{label}</span>
//       </div>

//       {/* Value */}
//       <div
//         className="
//       text-3xl font-semibold mb-6
//       transition-colors duration-300
//     "
//       >
//         {value}
//       </div>

//       {/* Change badge */}
//       <div
//         className={`
//       flex items-center justify-center sm:justify-start gap-1
//       px-3 py-1.5 w-fit mx-auto sm:mx-0
//       rounded-md
//       transition-all duration-300
//       hover:brightness-105
//       ${iconBgColor}
//     `}
//       >
//         <span className={`text-sm font-medium ${valueColor}`}>{change}%</span>
//         <span className="text-gray-400 text-sm">vs last month</span>
//       </div>
//     </div>
//   );
// }

// export default function StatsCard() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//       {stats.map((stat) => (
//         <StatCard key={stat.label} {...stat} />
//       ))}
//     </div>
//   );
// }
