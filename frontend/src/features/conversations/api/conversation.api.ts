// ==============================
// Imports
// ==============================

import { baseApi } from "@/api/baseApi";
import type { ConversationListResponse } from "../types/conversation.types";

// ==============================
// Conversation API
// ==============================

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==============================
    // Get Conversations
    // ==============================
    getConversations: builder.query<ConversationListResponse, void>({
      query: () => ({
        url: "/conversations",
        method: "GET",
      }),
      providesTags: ["Conversation"],
    }),

    // ==============================
    // Create Conversation
    // ==============================
    createConversation: builder.mutation<
      { success: boolean; message: string; data: any },
      { receiverId: string }
    >({
      query: (body) => ({
        url: "/conversations",
        method: "POST",
        data: body,
      }),
    }),
  }),
});

// ==============================
// Export Hooks
// ==============================

export const { useGetConversationsQuery, useCreateConversationMutation } = conversationApi;
