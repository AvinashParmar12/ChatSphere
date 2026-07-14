// ==============================
// Imports
// ==============================

import { baseApi } from "@/api/baseApi";

import type {
  ApiResponse,
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth.types";

// ==============================
// Auth API
// ==============================

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==============================
    // Register
    // ==============================
    register: builder.mutation<
      LoginResponse,
      RegisterRequest
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        data: body,
      }),
    }),

    // ==============================
    // Login
    // ==============================
    login: builder.mutation<
      LoginResponse,
      LoginRequest
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ==============================
    // Current User
    // ==============================
    getCurrentUser: builder.query<
      CurrentUserResponse,
      void
    >({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),

      providesTags: ["Auth"],
    }),

    // ==============================
    // Logout
    // ==============================
    logout: builder.mutation<
      ApiResponse,
      void
    >({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),

      invalidatesTags: ["Auth"],
    }),
  }),
});

// ==============================
// Export Hooks
// ==============================

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = authApi;