import { baseApi } from "@/api/baseApi";
import type { User } from "@/features/auth/types/auth.types";
import { setUser } from "@/features/auth/auth.slice";
import { conversationApi } from "@/features/conversations/api/conversation.api";
import { messageApi } from "@/features/messages/api/message.api";

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
        const state = getState() as any;
        const currentUser = state.auth.user as User | null;
        
        if (!currentUser) return;
        
        const optimisticUser = {
          ...currentUser,
          username: arg.username,
          bio: arg.bio !== undefined ? arg.bio : currentUser.bio,
        };

        // Optimistic Redux Update
        dispatch(setUser(optimisticUser));

        // Optimistic Selected Conversation Update
        const selectedConv = state.conversations.selectedConversation;
        if (selectedConv) {
          const updatedSelectedConv = { ...selectedConv };
          updatedSelectedConv.participants = updatedSelectedConv.participants.map((p: any) => {
            if (p._id === currentUser._id) {
              return { ...p, username: optimisticUser.username, bio: optimisticUser.bio };
            }
            return p;
          });
          if (updatedSelectedConv.lastMessage?.sender._id === currentUser._id) {
            updatedSelectedConv.lastMessage.sender.username = optimisticUser.username;
          }
          dispatch({ type: "conversations/setSelectedConversation", payload: updatedSelectedConv });
        }

        // Optimistic Conversations Update
        const patchConversations = dispatch(
          conversationApi.util.updateQueryData("getConversations", undefined, (draft) => {
            draft.data.forEach((conv) => {
              const participant = conv.participants.find((p) => p._id === currentUser._id);
              if (participant) {
                participant.username = optimisticUser.username;
                participant.bio = optimisticUser.bio;
              }
              if (conv.lastMessage?.sender._id === currentUser._id) {
                conv.lastMessage.sender.username = optimisticUser.username;
              }
            });
          })
        );

        // Optimistic Messages Update
        const queries = state.baseApi.queries;
        const messagePatches: any[] = [];
        
        Object.values(queries).forEach((query: any) => {
          if (query?.endpointName === "getMessages" && query?.originalArgs) {
            const patch = dispatch(
              messageApi.util.updateQueryData("getMessages", query.originalArgs, (draft) => {
                draft.data.messages.forEach((msg) => {
                  if (msg.sender._id === currentUser._id) {
                    msg.sender.username = optimisticUser.username;
                  }
                });
              })
            );
            messagePatches.push(patch);
          }
        });

        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data)); // Sync final user
        } catch {
          dispatch(setUser(currentUser)); // Rollback
          patchConversations.undo();
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
        const state = getState() as any;
        const currentUser = state.auth.user as User | null;
        
        if (!currentUser) return;
        
        const optimisticUser = {
          ...currentUser,
          avatar: previewUrl,
        };

        // Optimistic Redux Update
        dispatch(setUser(optimisticUser));

        // Optimistic Selected Conversation Update
        const selectedConv = state.conversations.selectedConversation;
        if (selectedConv) {
          const updatedSelectedConv = { ...selectedConv };
          updatedSelectedConv.participants = updatedSelectedConv.participants.map((p: any) => {
            if (p._id === currentUser._id) {
              return { ...p, avatar: optimisticUser.avatar };
            }
            return p;
          });
          if (updatedSelectedConv.lastMessage?.sender._id === currentUser._id) {
            updatedSelectedConv.lastMessage.sender.avatar = optimisticUser.avatar;
          }
          dispatch({ type: "conversations/setSelectedConversation", payload: updatedSelectedConv });
        }

        // Optimistic Conversations Update
        const patchConversations = dispatch(
          conversationApi.util.updateQueryData("getConversations", undefined, (draft) => {
            draft.data.forEach((conv) => {
              const participant = conv.participants.find((p) => p._id === currentUser._id);
              if (participant) {
                participant.avatar = optimisticUser.avatar;
              }
              if (conv.lastMessage?.sender._id === currentUser._id) {
                conv.lastMessage.sender.avatar = optimisticUser.avatar;
              }
            });
          })
        );

        // Optimistic Messages Update
        const queries = state.baseApi.queries;
        const messagePatches: any[] = [];
        
        Object.values(queries).forEach((query: any) => {
          if (query?.endpointName === "getMessages" && query?.originalArgs) {
            const patch = dispatch(
              messageApi.util.updateQueryData("getMessages", query.originalArgs, (draft) => {
                draft.data.messages.forEach((msg) => {
                  if (msg.sender._id === currentUser._id) {
                    msg.sender.avatar = optimisticUser.avatar;
                  }
                });
              })
            );
            messagePatches.push(patch);
          }
        });

        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.data)); // Sync final user with real Cloudinary URL
        } catch {
          dispatch(setUser(currentUser)); // Rollback
          patchConversations.undo();
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
  useUpdateAvatarMutation
} = userApi;
