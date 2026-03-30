import { baseApi } from "@/redux/hooks/baseApi";
import { UserStats } from "@/redux/types/userStatsType";

export const userStatsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserStats: builder.query<UserStats, void>({
      query: () => ({
        url: "/auth/me/stats",
        method: "GET",
      }),
      providesTags: ["DashboardStats"],
    }),
  }),
});

export const { useGetUserStatsQuery } = userStatsApi;
