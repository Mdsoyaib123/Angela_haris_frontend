// src/redux/features/transactions/transactionsApi.ts
import { baseApi } from "@/redux/hooks/baseApi";
import { TransactionsResponse } from "@/redux/types/transactions.type";

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing query for fetching transactions
    getTransactions: builder.query<TransactionsResponse, void>({
      query: () => `/stripe/admin/transactions`,
      providesTags: ["Transactions"],
    }),

    // NEW: CSV export mutation
    exportTransactionsCsv: builder.mutation<Blob, void>({
      query: () => ({
        url: `/stripe/admin/transactions/export/csv`,
        method: "GET",
        // Tell RTK Query to handle the response as a Blob
        responseHandler: (response) => response.blob(),
      }),
      // No transform needed; we want the raw blob
      transformResponse: (response: Blob) => response,
    }),
  }),
  overrideExisting: false,
});

// Export both hooks
export const { useGetTransactionsQuery, useExportTransactionsCsvMutation } =
  transactionsApi;
