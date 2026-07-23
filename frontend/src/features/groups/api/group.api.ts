import { baseApi } from "@/api/baseApi";
import type { BackendConversation } from "@/features/conversations/types/conversation.types";

interface GroupResponse {
  success: boolean;
  message: string;
  data: BackendConversation;
}

export const groupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation<GroupResponse, { groupName: string; participants: string[] }>({
      query: (body) => ({
        url: "/conversations/group",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Conversation"],
    }),
    renameGroup: builder.mutation<GroupResponse, { groupId: string; groupName: string }>({
      query: ({ groupId, groupName }) => ({
        url: `/conversations/group/${groupId}/name`,
        method: "PATCH",
        data: { groupName },
      }),
      invalidatesTags: ["Conversation"],
    }),
    addGroupMembers: builder.mutation<GroupResponse, { groupId: string; participants: string[] }>({
      query: ({ groupId, participants }) => ({
        url: `/conversations/group/${groupId}/members`,
        method: "PATCH",
        data: { participants },
      }),
      invalidatesTags: ["Conversation"],
    }),
    removeGroupMembers: builder.mutation<GroupResponse, { groupId: string; participants: string[] }>({
      query: ({ groupId, participants }) => ({
        url: `/conversations/group/${groupId}/remove-members`,
        method: "PATCH",
        data: { participants },
      }),
      invalidatesTags: ["Conversation"],
    }),
    leaveGroup: builder.mutation<GroupResponse, string>({
      query: (groupId) => ({
        url: `/conversations/group/${groupId}/leave`,
        method: "PATCH",
      }),
      invalidatesTags: ["Conversation"],
    }),
    updateGroupAvatar: builder.mutation<GroupResponse, { groupId: string; formData: FormData }>({
      query: ({ groupId, formData }) => ({
        url: `/conversations/group/${groupId}/avatar`,
        method: "PATCH",
        data: formData,
      }),
      invalidatesTags: ["Conversation"],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useRenameGroupMutation,
  useAddGroupMembersMutation,
  useRemoveGroupMembersMutation,
  useLeaveGroupMutation,
  useUpdateGroupAvatarMutation,
} = groupApi;
