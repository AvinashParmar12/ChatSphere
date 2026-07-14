import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/api/baseApi";
import authReducer from "@/features/auth/auth.slice";
import conversationReducer from "@/features/conversations/conversation.slice";

export const store = configureStore({
  reducer: {
  auth: authReducer,
  conversations: conversationReducer,

  [baseApi.reducerPath]:
    baseApi.reducer,
},

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      baseApi.middleware
    ),
});