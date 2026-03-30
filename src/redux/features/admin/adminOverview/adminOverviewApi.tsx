import { baseApi } from "@/redux/hooks/baseApi";
import {
  DashboardStatsResponse,
  TransformedDashboardStats,
} from "@/redux/types/adminOverviewType";

export const adminOverviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboardStats: builder.query<TransformedDashboardStats, void>({
      query: () => ({
        url: "/admin/admin/dashboard-stats",
        method: "GET",
      }),
      providesTags: ["DashboardStats"],

      // Transform the response to match our component needs
      transformResponse: (response: DashboardStatsResponse) => {
        const { data } = response;

        // Transform monthly stats for the chart
        const monthlyEngagement = data.currentYearStats.monthlyStats.map(
          (stat) => ({
            month: stat.month,
            value: stat.newUsers,
          }),
        );

        return {
          totalUsers: {
            value: data.totalUsers.count.toString(),
            change: `+${data.totalUsers.percentageChange}`,
          },
          activeAthletes: {
            value: data.activeAthletes.count.toString(),
            change: `+${data.activeAthletes.percentageChange}`,
          },
          videoUploads: {
            value: data.videoUploads.count.toString(),
            change: `+${data.videoUploads.percentageChange}`,
          },
          totalViews: {
            value: data.totalviews.count.toString(),
            change: data.totalviews.percentageChange.toString(),
          },
          monthlyEngagement,
          currentYearStats: data.currentYearStats,
        };
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetAdminDashboardStatsQuery } = adminOverviewApi;

// import { baseApi } from "@/redux/hooks/baseApi";
// import {
//   DashboardStatsResponse,
//   TransformedDashboardStats,
// } from "@/redux/types/adminOverviewType";

// export const adminOverviewApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getDashboardStats: builder.query<TransformedDashboardStats, void>({
//       query: () => ({
//         url: "/admin/admin/dashboard-stats",
//         method: "GET",
//       }),
//       providesTags: ["DashboardStats"],

//       // Transform the response to match our component needs
//       transformResponse: (response: DashboardStatsResponse) => {
//         const { data } = response;

//         // Transform monthly stats for the chart
//         const monthlyEngagement = data.currentYearStats.monthlyStats.map(
//           (stat) => ({
//             month: stat.month,
//             value: stat.newUsers,
//           }),
//         );

//         return {
//           totalUsers: {
//             value: data.totalUsers.count.toString(),
//             change: `+${data.totalUsers.percentageChange}`,
//           },
//           activeAthletes: {
//             value: data.activeAthletes.count.toString(),
//             change: `+${data.activeAthletes.percentageChange}`,
//           },
//           videoUploads: {
//             value: data.videoUploads.count.toString(),
//             change: `+${data.videoUploads.percentageChange}`,
//           },
//           monthlyEngagement,
//         };
//       },
//     }),
//   }),
//   overrideExisting: false,
// });

// export const { useGetDashboardStatsQuery } = adminOverviewApi;

// import { baseApi } from "@/redux/hooks/baseApi";
// import { DashboardStatsResponse } from "@/redux/types/adminOverviewType";

// export const adminOverviewApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getDashboardStats: builder.query<DashboardStatsResponse, void>({
//       query: () => ({
//         url: "/admin/admin/dashboard-stats",
//         method: "GET",
//       }),
//       providesTags: ["DashboardStats"],
//     }),
//   }),
// });

// export const { useGetDashboardStatsQuery } = adminOverviewApi;
