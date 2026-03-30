import { baseApi } from "@/redux/hooks/baseApi";
import {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
  CurrentPlanResponse,
  PricingApiResponse,
  TransactionDetailsResponse,
} from "@/redux/types/stripe.type";

export const stripeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStripePlans: builder.query<PricingApiResponse, void>({
      query: () => ({
        url: "/stripe/plans",
      }),
      providesTags: ["Transactions"],
    }),
    createStripeCheckoutSession: builder.mutation<
      CreateCheckoutSessionResponse,
      CreateCheckoutSessionRequest
    >({
      query: (body) => ({
        url: "/stripe/create-checkout-session",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Transactions"],
    }),
    currentPlan: builder.query<CurrentPlanResponse, void>({
      query: () => ({
        url: "/stripe/me/current-plan",
      }),
      providesTags: ["Transactions"],
    }),

    // NEW: CSV export mutation
    exportMeTransactionsCsv: builder.mutation<Blob, void>({
      query: () => ({
        url: `/stripe/me/transactions/export/csv`,
        method: "GET",
        // Tell RTK Query to handle the response as a Blob
        responseHandler: (response) => response.blob(),
      }),
      // No transform needed; we want the raw blob
      transformResponse: (response: Blob) => response,
    }),

    getTransactionById: builder.query<TransactionDetailsResponse, string>({
      query: (id) => `/stripe/transaction/${id}`,
      providesTags: ["Transactions"],
    }),
  }),
});

export const {
  useGetStripePlansQuery,
  useCreateStripeCheckoutSessionMutation,
  useCurrentPlanQuery,
  useExportMeTransactionsCsvMutation,
  useGetTransactionByIdQuery,
} = stripeApi;
