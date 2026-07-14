// ==============================
// Imports
// ==============================

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BackendConversation } from "./types/conversation.types";

// ==============================
// Types
// ==============================

interface ConversationState {
  selectedConversationId: string | null;
  selectedConversation: BackendConversation | null;
  isGroup: boolean | null;
}

// ==============================
// Initial State
// ==============================

const initialState: ConversationState = {
  selectedConversationId: null,
  selectedConversation: null,
  isGroup: null,
};

// ==============================
// Slice
// ==============================

const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setSelectedConversation: (
      state,
      action: PayloadAction<BackendConversation>
    ) => {
      state.selectedConversationId = action.payload._id;
      state.selectedConversation = action.payload;
      state.isGroup = action.payload.isGroup;
    },

    clearSelectedConversation: (state) => {
      state.selectedConversationId = null;
      state.selectedConversation = null;
      state.isGroup = null;
    },
  },
});

// ==============================
// Exports
// ==============================

export const {
  setSelectedConversation,
  clearSelectedConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
