import { baseApi } from "@/redux/hooks/baseApi";
import {
  HighlightsResponse,
  RemoveClipRequest,
  RemoveClipResponse,
} from "@/redux/types/adminMediaMonitoringTypes";

export const adminMediaMonitoringApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all highlights
    getHighlights: builder.query<HighlightsResponse, void>({
      query: () => ({
        url: "/highlights",
        method: "GET",
      }),
      providesTags: ["Highlights"],
    }),

    // Remove clip from highlight
    removeClip: builder.mutation<RemoveClipResponse, RemoveClipRequest>({
      query: (data) => ({
        url: "/highlights/remove-clip",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Highlights"],
    }),
  }),
});

export const { useGetHighlightsQuery, useRemoveClipMutation } =
  adminMediaMonitoringApi;
