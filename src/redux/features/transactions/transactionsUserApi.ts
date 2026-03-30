// src/redux/features/transactions/transactionsApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
// import { TransactionsResponse } from "@/redux/types/transactions.type";
import { TransactionsUserResponse } from "@/redux/types/transactionsUser.type";

// Extend baseApi for transactions
export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserTransactions: builder.query<TransactionsUserResponse, void>({
      query: () => `/stripe/me/transactions`,
      providesTags: ["Transactions", "User"],
    }),
  }),
  overrideExisting: false,
});

// Export the hook to use in components
export const { useGetUserTransactionsQuery } = transactionsApi;
