// ==============================
// Imports
// ==============================

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ==============================
// Types
// ==============================

interface MessageState {
  selectedMessageId: string | null;
}

// ==============================
// Initial State
// ==============================

const initialState: MessageState = {
  selectedMessageId: null,
};

// ==============================
// Slice
// ==============================

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setSelectedMessageId: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.selectedMessageId = action.payload;
    },
  },
});

// ==============================
// Exports
// ==============================

export const { setSelectedMessageId } = messageSlice.actions;

export default messageSlice.reducer;
