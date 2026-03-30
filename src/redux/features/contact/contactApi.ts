import { baseApi } from "@/redux/hooks/baseApi";

export interface ContactMessageRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse {
  success: boolean;
  message: string;
  data: any;
}

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendContactMessage: builder.mutation<
      ContactMessageResponse,
      ContactMessageRequest
    >({
      query: (body) => ({
        url: "/send-road-map-and-organization-name/send-contact-message",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendContactMessageMutation } = contactApi;
