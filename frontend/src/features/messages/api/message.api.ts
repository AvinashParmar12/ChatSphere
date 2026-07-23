// ==============================
// Imports
// ==============================

import { baseApi } from "@/api/baseApi";
import type { MessageListResponse, MessageResponse, SendMessageRequest } from "../types/message.types";

// ==============================
// Message API
// ==============================

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==============================
    // Get Messages
    // ==============================
    getMessages: builder.query<
      MessageListResponse,
      { conversationId: string; page?: number; limit?: number }
    >({
      query: ({ conversationId, page = 1, limit = 20 }) => ({
        url: `/messages/${conversationId}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: (_result, _error, arg) => [
        { type: "Message", id: arg.conversationId }
      ],
    }),

    // ==============================
    // Send Message
    // ==============================
    sendMessage: builder.mutation<MessageResponse, SendMessageRequest>({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        data: body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Message", id: arg.conversationId },
      ],
    }),

    // ==============================
    // Mark as Read
    // ==============================
    markAsRead: builder.mutation<{ success: boolean; message: string }, string>({
      query: (conversationId) => ({
        url: `/messages/${conversationId}/read`,
        method: "PATCH",
      }),
    }),
  }),
});

// ==============================
// Export Hooks
// ==============================

export const { useGetMessagesQuery, useSendMessageMutation, useMarkAsReadMutation } = messageApi;
