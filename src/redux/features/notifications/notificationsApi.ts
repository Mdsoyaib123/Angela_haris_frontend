import { baseApi } from "@/redux/hooks/baseApi";
import { Notification } from "@/redux/types/notifications.type";

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => ({
        url: "/notifications",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Notification" as const,
                id,
              })),
              { type: "Notification", id: "LIST" },
            ]
          : [{ type: "Notification", id: "LIST" }],
    }),
    getNotificationUnread: builder.query<Notification[], void>({
      query: () => ({
        url: "/notifications/unread",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Notification" as const,
                id,
              })),
              { type: "Notification", id: "UNREAD_LIST" },
            ]
          : [{ type: "Notification", id: "UNREAD_LIST" }],
    }),
    markNotificationAsRead: builder.mutation<Notification, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Notification", id },
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_LIST" },
      ],
    }),
    markAllAsRead: builder.mutation<{ count: number }, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: "UNREAD_LIST" },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetNotificationUnreadQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;
