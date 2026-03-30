import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useGetAdminDashboardStatsQuery } from "@/redux/features/admin/adminOverview/adminOverviewApi";

export default function PlatformEngagementChart() {
  const { data: stats, isLoading } = useGetAdminDashboardStatsQuery();

  // If we have data, use it; otherwise show empty state with loading skeleton
  const chartData = stats?.monthlyEngagement || [];

  // Find max value for YAxis domain
  const maxValue =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.value), 10) : 100;

  // Create YAxis ticks based on max value
  const yAxisTicks = [
    0,
    Math.ceil(maxValue * 0.25),
    Math.ceil(maxValue * 0.5),
    Math.ceil(maxValue * 0.75),
    maxValue,
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
      <div className="xl:col-span-4 w-full">
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <div className="min-w-150 p-4 bg-white">
            <h3 className="mb-4 text-[20px] font-medium text-[#1D2028]">
              New Users -{" "}
              {stats?.currentYearStats?.year || new Date().getFullYear()}
            </h3>

            {/* Chart area */}
            <div className="h-60 sm:h-70 md:h-80">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-pulse bg-gray-200 w-full h-48 rounded"></div>
                </div>
              ) : chartData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient
                        id="engagementGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#22c55e"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="#22c55e"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#e5e7eb"
                      strokeDasharray="4 4"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="month"
                      interval={0}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={15}
                      padding={{ left: 5, right: 5 }}
                    />

                    <YAxis
                      domain={[0, maxValue]}
                      ticks={yAxisTicks}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      width={35}
                      padding={{ top: 5, bottom: 5 }}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [
                        `${value} new users`,
                        "New Users",
                      ]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#22c55e"
                      strokeWidth={2.5}
                      fill="url(#engagementGradient)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: "#22c55e",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                      fillOpacity={1}
                      baseValue={0}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Summary stats */}
            {!isLoading && chartData.length > 0 && stats?.currentYearStats && (
              <div className="mt-4 text-sm text-gray-500 flex justify-between items-center border-t pt-4">
                <span>Total new users in {stats.currentYearStats.year}:</span>
                <span className="font-semibold text-emerald-600">
                  {stats.currentYearStats.totalNewUsers}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// const engagementData = [
//   { month: "Jan", value: 50 },
//   { month: "", value: 280 },
//   { month: "Feb", value: 480 },
//   { month: "", value: 350 },
//   { month: "Mar", value: 420 },
//   { month: "", value: 380 },
//   { month: "Apr", value: 520 },
//   { month: "", value: 450 },
//   { month: "May", value: 620 },
//   { month: "", value: 700 },
//   { month: "Jun", value: 780 },
//   { month: "", value: 850 },
//   { month: "Jul", value: 950 },
//   { month: "", value: 1050 },
//   { month: "Aug", value: 1150 },
//   { month: "", value: 1280 },
//   { month: "Sep", value: 1180 },
//   { month: "", value: 1100 },
//   { month: "Oct", value: 1200 },
//   { month: "", value: 1380 },
//   { month: "Nov", value: 1500 },
//   { month: "", value: 1420 },
//   { month: "Dec", value: 1380 },
// ];

// export default function PlatformEngagementChart() {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-4 gap-5">
//       <div className="xl:col-span-4 w-full">
//         <div className="overflow-x-auto rounded-lg border border-gray-200">
//           <div className="min-w-150 p-4 bg-white">
//             <h3 className="mb-4 text-[20px] font-medium text-[#1D2028]">
//               Platform Engagement
//             </h3>

//             {/* Chart area */}
//             <div className="h-60 sm:h-70 md:h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart
//                   data={engagementData}
//                   margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
//                 >
//                   <defs>
//                     <linearGradient
//                       id="engagementGradient"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop
//                         offset="0%"
//                         stopColor="#22c55e"
//                         stopOpacity={0.35}
//                       />
//                       <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>

//                   <CartesianGrid
//                     stroke="#e5e7eb"
//                     strokeDasharray="4 4"
//                     vertical={false}
//                   />

//                   <XAxis
//                     dataKey="month"
//                     interval={0}
//                     tick={{ fill: "#64748b", fontSize: 11 }}
//                     tickLine={false}
//                     axisLine={false}
//                     minTickGap={15}
//                     padding={{ left: 5, right: 5 }}
//                   />

//                   <YAxis
//                     domain={[0, 1500]}
//                     ticks={[0, 250, 500, 750, 1000, 1250, 1500]}
//                     tick={{ fill: "#64748b", fontSize: 11 }}
//                     tickLine={false}
//                     axisLine={false}
//                     width={35}
//                     padding={{ top: 5, bottom: 5 }}
//                   />

//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "white",
//                       border: "1px solid #e5e7eb",
//                       borderRadius: "8px",
//                       boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//                       fontSize: "12px",
//                     }}
//                   />

//                   <Area
//                     type="monotone"
//                     dataKey="value"
//                     stroke="#22c55e"
//                     strokeWidth={2.5}
//                     fill="url(#engagementGradient)"
//                     dot={false}
//                     activeDot={{
//                       r: 5,
//                       fill: "#22c55e",
//                       stroke: "#ffffff",
//                       strokeWidth: 2,
//                     }}
//                     fillOpacity={1}
//                     baseValue={0}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
