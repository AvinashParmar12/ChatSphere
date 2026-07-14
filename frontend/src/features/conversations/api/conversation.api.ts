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
  }),
});

// ==============================
// Export Hooks
// ==============================

export const { useGetConversationsQuery } = conversationApi;
