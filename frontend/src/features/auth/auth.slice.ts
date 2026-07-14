// ==============================
// Imports
// ==============================

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "./types/auth.types";

// ==============================
// Types
// ==============================

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

// ==============================
// Initial State
// ==============================

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

// ==============================
// Slice
// ==============================

const authSlice = createSlice({
  name: "auth",

  initialState,

reducers: {
  setAuthenticated: (
    state,
    action: PayloadAction<boolean>
  ) => {
    state.isAuthenticated = action.payload;
  },

  setUser: (
    state,
    action: PayloadAction<User | null>
  ) => {
    state.user = action.payload;
  },

  setLoading: (
    state,
    action: PayloadAction<boolean>
  ) => {
    state.isLoading = action.payload;
  },
},
});

// ==============================
// Exports
// ==============================

export const {
  setAuthenticated,
  setUser,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;