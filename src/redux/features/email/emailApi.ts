import { baseApi } from "@/redux/hooks/baseApi";

export interface SendEmailRequest {
  email: string; // recipient email
  subject: string;
  content: string;
  userName: string; // sender's name
}

interface SendEmailResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: null;
}

export const emailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendEmail: builder.mutation<SendEmailResponse, SendEmailRequest>({
      query: (body) => ({
        url: "/auth/send-mail",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendEmailMutation } = emailApi;
