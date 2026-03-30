import { baseApi } from "@/redux/hooks/baseApi";
import {
  DashboardRequest,
  DashboardResponse,
} from "@/redux/types/dashboardStats.type";

export const dashboardStatsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardResponse, DashboardRequest>({
      query: () => ({
        url: "/stripe/dashboard-stats",
        providesTags: ["DashboardStats"],
      }),
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardStatsApi;
