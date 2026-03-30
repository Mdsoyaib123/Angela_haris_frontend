import { baseApi } from "@/redux/hooks/baseApi";
import {
  User,
  LoginRequest,
  LoginResponse,
  LoginSessionsResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyTwoStepVerificationRequest,
  VerifyTwoStepVerificationResponse,
} from "@/redux/types/auth.type";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest | FormData>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    authMe: builder.query<{ success: boolean; data: { user: User } }, void>({
      query: () => ({
        url: "/auth/me",
      }),
      providesTags: ["User"],
    }),
    getLoginSessions: builder.query<LoginSessionsResponse, void>({
      query: () => "/auth/login-sessions",
      providesTags: ["User"],
    }),
    // 🔹 New forgotPassword mutation
    forgotPassword: builder.mutation<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: { message: string };
      },
      { email: string }
    >({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    verifyOtp: builder.mutation<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: { message: string };
      },
      { email: string; code: string }
    >({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),
    forgetResetPassword: builder.mutation<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: { message: string };
      },
      { email: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/auth/forget-reset-password",
        method: "POST",
        body: data,
      }),
    }),
    updateTwoStepVerificationStatus: builder.mutation<
      {
        statusCode: number;
        success: boolean;
        message: string;
        data: any;
      },
      { userId: string; isTwoStepVerification: boolean }
    >({
      query: (data) => ({
        url: "/auth/update-two-step-verification-status",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    verifyTwoStepVerification: builder.mutation<
      VerifyTwoStepVerificationResponse,
      VerifyTwoStepVerificationRequest
    >({
      query: (data) => ({
        url: "/auth/verify-two-step-verification",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useAuthMeQuery,
  useGetLoginSessionsQuery,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useForgetResetPasswordMutation,
  useUpdateTwoStepVerificationStatusMutation,
  useVerifyTwoStepVerificationMutation,
} = authApi;
