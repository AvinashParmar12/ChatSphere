import { baseApi } from "@/api/baseApi";
import type { BackendNotification, NotificationListResponse } from "../types/notification.types";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationListResponse, void>({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    markAsRead: builder.mutation<{ success: boolean; data: BackendNotification }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData("getNotifications", undefined, (draft) => {
            const notification = draft.data.find((n) => n._id === id);
            if (notification) {
              notification.isRead = true;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    markAllAsRead: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationApi.util.updateQueryData("getNotifications", undefined, (draft) => {
            draft.data.forEach((n) => {
              n.isRead = true;
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;
