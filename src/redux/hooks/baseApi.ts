import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

// const baseURL = import.meta.env.VITE_API_ENDPOINT;
const baseURL = `https://api.highlightzapp.com/api/v1`;
// const baseURL = "http://localhost:5001/api/v1";
if (!baseURL) {
  throw new Error("VITE_API_ENDPOINT is not defined in environment variables");
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include", // Changed from "omit" to "include"
  prepareHeaders: (headers) => {
    const token = Cookies.get("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithErrorHandler: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions,
) => {
  try {
    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      Cookies.remove("token");
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    return {
      error: {
        status: "FETCH_ERROR",
        error: "Failed to fetch",
      },
    };
  }
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithErrorHandler,
  tagTypes: [
    "User",
    "DashboardStats",
    "Transactions",
    "Posts",
    "Highlights",
    "ChatList",
    "Notification",
    "ChatHistory",
    "Organization",
  ],
  endpoints: () => ({}),
});
