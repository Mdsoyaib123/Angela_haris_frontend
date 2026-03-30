import { baseApi } from "@/redux/hooks/baseApi";
import {
  AllUsersResponse,
  UserDetailsResponse,
  //   ExtendedUserDetails,
  AddUserRequest,
  AddUserResponse,
  ManageUserResponse,
  UserDetailsV2Response,
} from "@/redux/types/AdminAllUserType";

export const adminAllUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users with pagination
    getAllUsers: builder.query<
      AllUsersResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/admin/allUsers",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.users.map(({ id }) => ({
                type: "User" as const,
                id,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // Get user details by ID (first endpoint)
    getUserDetails: builder.query<UserDetailsResponse, string>({
      query: (userId) => ({
        url: `/admin/user-details/${userId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // Get user details by ID (second endpoint - returns different structure)
    getUserDetailsV2: builder.query<UserDetailsV2Response, string>({
      query: (userId) => ({
        url: `/admin/userDetails/${userId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    // Add new user
    addUser: builder.mutation<AddUserResponse, AddUserRequest>({
      query: (userData) => ({
        url: "/admin/add-user",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // Manage user (deactivate - no action param)
    deactivateUser: builder.mutation<ManageUserResponse, string>({
      query: (userId) => ({
        url: `/admin/manage-user/${userId}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // Manage user (soft delete - with action=delete)
    softDeleteUser: builder.mutation<ManageUserResponse, string>({
      query: (userId) => ({
        url: `/admin/manage-user/${userId}`,
        method: "POST",
        params: { action: "delete" },
        body: {},
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    // Reactivate user (if needed - you might need to check if there's an endpoint for this)
    reactivateUser: builder.mutation<ManageUserResponse, string>({
      query: (userId) => ({
        url: `/admin/manage-user/${userId}`,
        method: "POST",
        params: { action: "reactivate" },
        body: {},
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    manageUser: builder.mutation<
      ManageUserResponse,
      { userId: string; action: "activate" | "deactivate" | "delete" }
    >({
      query: ({ userId, action }) => ({
        url: `/admin/manage-user/${userId}`,
        method: "POST",
        params: { action },
        body: {},
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),

    // Update user subscription plan
    updateUserSubscriptionPlan: builder.mutation<
      ManageUserResponse,
      { userId: string; planId: string }
    >({
      query: (body) => ({
        url: "/admin/update-user-subscription-plan",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserDetailsQuery,
  useGetUserDetailsV2Query,
  useAddUserMutation,
  useDeactivateUserMutation,
  useSoftDeleteUserMutation,
  useReactivateUserMutation,
  useManageUserMutation,
  useUpdateUserSubscriptionPlanMutation,
} = adminAllUserApi;
