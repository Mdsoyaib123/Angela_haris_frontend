import Loader from "@/components/AdminDashboard/Shared/Loader";
import { MetricCard } from "./MetricCard";
import { useGetUserStatsQuery } from "@/redux/features/user/userStatsApi";

const Dashboard = () => {
  const { data, isLoading, isError } = useGetUserStatsQuery();

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Loader />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load dashboard stats.
      </div>
    );
  }

  // const metrics = [
  //   {
  //     label: "Profile Views",
  //     value: data.profileViews,
  //     bgColor: "bg-gray-50",
  //   },
  //   {
  //     label: "Profile Link Clicks",
  //     value: 0, // Not in API yet
  //     bgColor: "bg-blue-50",
  //   },
  //   {
  //     label: "Highlight Reel Views",
  //     value: data.highlights.totalViews,
  //     bgColor: "bg-purple-50",
  //   },
  //   {
  //     label: "Last Viewed Date",
  //     value: data.lastViewed
  //       ? new Date(data.lastViewed).toLocaleDateString()
  //       : "N/A",
  //     bgColor: "bg-green-50",
  //   },
  // ];

  const metrics = [
    {
      label: "Profile Views",
      value: data?.profileViews ?? 0,
      bgColor: "bg-green-50",
    },
    {
      label: "Last Viewed",
      value: data?.lastViewed
        ? new Date(data.lastViewed).toLocaleDateString()
        : "N/A",
      bgColor: "bg-gray-50",
    },
    {
      label: "Highlights Created",
      value: data?.highlights?.totalCount ?? 0,
      bgColor: "bg-blue-50",
    },
    {
      label: "Highlight Views",
      value: data?.highlights?.totalViews ?? 0,
      bgColor: "bg-purple-50",
    },
    {
      label: "Highlight Likes",
      value: data?.highlights?.totalLikes ?? 0,
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="min-h-fit flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-12">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            bgColor={metric.bgColor}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// import { MetricCard } from "./MetricCard";

// const metrics = [
//   { label: "Profile Views", value: "2", bgColor: "bg-gray-50" },
//   { label: "Profile Link Clicks", value: "2", bgColor: "bg-blue-50" },
//   { label: "Highlight Reel Views", value: "1", bgColor: "bg-purple-50" },
//   { label: "Last Viewed Date", value: "1", bgColor: "bg-green-50" },
// ];
// const Dashboard = () => {
//   return (
//     <div className="min-h-fit flex flex-col">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
//         {metrics.map((metric) => (
//           <MetricCard
//             key={metric.label}
//             label={metric.label}
//             value={metric.value}
//             bgColor={metric.bgColor}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
