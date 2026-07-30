import { baseApi } from "@/api/baseApi";
import type { User } from "@/features/auth/types/auth.types";
import { setUser } from "@/features/auth/auth.slice";
import { conversationApi } from "@/features/conversations/api/conversation.api";
import { messageApi } from "@/features/messages/api/message.api";
import { setSelectedConversation } from "@/features/conversations/conversation.slice";
import type { RootState, AppDispatch } from "@/store";
import type { BackendConversation } from "@/features/conversations/types/conversation.types";

interface SearchUsersResponse {
  success: boolean;
  message: string;
  data: User[];
}

interface UpdateProfileRequest {
  username: string;
  bio?: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: User;
}

interface UpdateAvatarResponse {
  success: boolean;
  message: string;
  data: User;
}

// Helper for duplicated optimistic cache updates
const updateOptimisticCaches = (
  dispatch: AppDispatch,
  state: RootState,
  optimisticUser: User
) => {
  const currentUser = state.auth.user;
  if (!currentUser) return { patchConversations: null, messagePatches: [] };

  // 1. Optimistic Redux Update
  dispatch(setUser(optimisticUser));

  // 2. Optimistic Selected Conversation Update
  const selectedConv = state.conversations.selectedConversation;
  if (selectedConv) {
    const updatedSelectedConv: BackendConversation = {
      ...selectedConv,
      participants: selectedConv.participants.map((p) => {
        if (p._id === currentUser._id) {
          return {
             ...p,
             username: optimisticUser.username,
             avatar: optimisticUser.avatar,
             bio: optimisticUser.bio,
          };
        }
        return p;
      }),
      lastMessage: selectedConv.lastMessage
        ? {
            ...selectedConv.lastMessage,
            sender:
              selectedConv.lastMessage.sender._id === currentUser._id
                ? {
                    ...selectedConv.lastMessage.sender,
                    username: optimisticUser.username,
                    avatar: optimisticUser.avatar,
                  }
                : selectedConv.lastMessage.sender,
          }
        : undefined,
    };
    dispatch(setSelectedConversation(updatedSelectedConv));
  }

  // 3. Optimistic Conversations Update
  const patchConversations = dispatch(
    conversationApi.util.updateQueryData("getConversations", undefined, (draft) => {
      draft.data.forEach((conv) => {
        const participant = conv.participants.find((p) => p._id === currentUser._id);
        if (participant) {
          participant.username = optimisticUser.username;
          participant.avatar = optimisticUser.avatar;
          if (optimisticUser.bio !== undefined) participant.bio = optimisticUser.bio;
        }
        if (conv.lastMessage?.sender._id === currentUser._id) {
          conv.lastMessage.sender.username = optimisticUser.username;
          conv.lastMessage.sender.avatar = optimisticUser.avatar;
        }
      });
    })
  );

  // 4. Optimistic Messages Update
  type QueryState = Record<string, { endpointName?: string; originalArgs?: unknown }>;
  const queries = state.baseApi.queries as unknown as QueryState;
  const messagePatches: Array<{ undo: () => void }> = [];

  Object.values(queries).forEach((query) => {
    if (query?.endpointName === "getMessages" && query?.originalArgs) {
      const patch = dispatch(
        messageApi.util.updateQueryData(
          "getMessages",
          query.originalArgs as { conversationId: string; page?: number; limit?: number },
          (draft) => {
            draft.data.messages.forEach((msg) => {
              if (msg.sender._id === currentUser._id) {
                msg.sender.username = optimisticUser.username;
                msg.sender.avatar = optimisticUser.avatar;
              }
            });
          }
        )
      );
      messagePatches.push(patch);
    }
  });

  return { patchConversations, messagePatches };
};

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchUsers: builder.query<SearchUsersResponse, string>({
      query: (keyword) => ({
        url: `/users/search?q=${encodeURIComponent(keyword)}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),

    updateProfile: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: (body) => ({
        url: "/users/profile",
        method: "PATCH",
        data: body,
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const currentUser = state.auth.user;

        if (!currentUser) return;

        const optimisticUser: User = {
          ...currentUser,
          username: arg.username,
          bio: arg.bio !== undefined ? arg.bio : currentUser.bio,
        };

        const { patchConversations, messagePatches } = updateOptimisticCaches(
          dispatch as AppDispatch,
          state,
          optimisticUser
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data)); // Sync final user
        } catch {
          dispatch(setUser(currentUser)); // Rollback
          if (patchConversations) patchConversations.undo();
          messagePatches.forEach((p) => p.undo());
        }
      },
    }),

    updateAvatar: builder.mutation<UpdateAvatarResponse, { formData: FormData; previewUrl: string }>({
      query: ({ formData }) => ({
        url: "/users/avatar",
        method: "PATCH",
        data: formData,
      }),
      async onQueryStarted({ previewUrl }, { dispatch, getState, queryFulfilled }) {
        const state = getState() as RootState;
        const currentUser = state.auth.user;

        if (!currentUser) return;

        const optimisticUser: User = {
          ...currentUser,
          avatar: previewUrl,
        };

        const { patchConversations, messagePatches } = updateOptimisticCaches(
          dispatch as AppDispatch,
          state,
          optimisticUser
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data)); // Sync final user with real Cloudinary URL
        } catch {
          dispatch(setUser(currentUser)); // Rollback
          if (patchConversations) patchConversations.undo();
          messagePatches.forEach((p) => p.undo());
        }
      },
    }),
  }),
});

export const {
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useUpdateProfileMutation,
  useUpdateAvatarMutation,
} = userApi;
