import { baseApi } from "@/redux/hooks/baseApi";
import {
  GetHighlightsResponse,
  MergeVideoRequest,
  MergeVideoResponse,
} from "@/redux/types/reels.type";

export const reelsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReels: builder.query<GetHighlightsResponse, void>({
      query: () => ({
        url: "/highlights",
      }),
    }),
    mergeVideos: builder.mutation<
      MergeVideoResponse["data"],
      MergeVideoRequest
    >({
      query: (body) => {
        const formData = new FormData();
        formData.append("caption", body.caption);
        formData.append("description", body.description);
        body.clips.forEach((file) => {
          formData.append("clips", file);
        });

        return {
          url: "/highlights/merge-video",
          method: "POST",
          body: formData,
          // Important: do not set Content-Type, fetchBaseQuery will set the correct boundary
        };
      },
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const { useMergeVideosMutation, useGetReelsQuery } = reelsApi;
