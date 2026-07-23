import { baseApi } from "@/api/baseApi";
import type { User } from "@/features/auth/types/auth.types";

interface SearchUsersResponse {
  success: boolean;
  message: string;
  data: User[];
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchUsers: builder.query<SearchUsersResponse, string>({
      query: (keyword) => ({
        url: `/users/search?q=${encodeURIComponent(keyword)}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useSearchUsersQuery, useLazySearchUsersQuery } = userApi;
