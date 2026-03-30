import { baseApi } from "@/redux/hooks/baseApi";

export interface SendRoadmapRequest {
  email: string;
}

export interface SendRoadmapResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: any;
}

export const roadmapApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendRoadmap: builder.mutation<SendRoadmapResponse, SendRoadmapRequest>({
      query: (body) => ({
        url: "/send-road-map-and-organization-name/send-roadmap",
        method: "POST",
        body,
      }),
    }),
    sendOrganizationName: builder.mutation<
      SendRoadmapResponse,
      { organizationName: string; Organizationemail: string }
    >({
      query: (body) => ({
        url: "/send-road-map-and-organization-name/send-organization-name",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendRoadmapMutation, useSendOrganizationNameMutation } =
  roadmapApi;
