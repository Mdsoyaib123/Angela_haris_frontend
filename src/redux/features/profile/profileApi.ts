import { baseApi } from "@/redux/hooks/baseApi";
import {
  ApiResponse,
  ProfileData,
  UpdateProfilePayload,
  ChangePasswordPayload,
  PasswordChangeResponse,
  // ProfileResponse,
  // GetCurrentUserResponse,
} from "@/redux/types/profile.types";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Update Profile - PATCH with multipart/form-data
    updateProfile: builder.mutation<
      ApiResponse<ProfileData>,
      UpdateProfilePayload
    >({
      query: (profileData) => {
        const formData = new FormData();

        // Append all fields to FormData
        Object.entries(profileData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === "image" && value instanceof File) {
              formData.append("image", value);
            } else {
              formData.append(key, String(value));
            }
          }
        });

        return {
          url: "/auth/update-profile",
          method: "PATCH",
          body: formData,
          // Don't set Content-Type header, let browser set it with boundary
        };
      },
      invalidatesTags: ["User"],
    }),

    // Change Password - PATCH with JSON
    changePassword: builder.mutation<
      ApiResponse<PasswordChangeResponse>,
      ChangePasswordPayload
    >({
      query: (passwordData) => ({
        url: "/auth/change-password",
        method: "PATCH",
        body: passwordData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Get Current User Profile
    // getCurrentUser: builder.query<ApiResponse<ProfileResponse>, void>({
    // // Get Current User Profile
    // getCurrentUser: builder.query<ApiResponse<ProfileData>, void>({
    //   query: () => ({
    //     url: "/auth/me", // Adjust endpoint as needed
    //     method: "GET",
    //   }),
    //   providesTags: ["User"],
    // }),
    getCurrentUser: builder.query<ApiResponse<{ user: ProfileData }>, void>({
      // Then in profileApi.ts:
      // getCurrentUser: builder.query<ApiResponse<GetCurrentUserResponse>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Get User Profile by ID
    getUserById: builder.query<ApiResponse<ProfileData>, string>({
      query: (id) => ({
        url: `/auth/user/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),

    profileView: builder.mutation<{ message: string }, string>({
      query: (userId) => ({
        url: `/auth/profile-view/${userId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useProfileViewMutation,
} = profileApi;
