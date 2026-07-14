import { useGetConversationsQuery } from "../api/conversation.api";

export const useConversations = () => {
  const { data, isLoading, isError, refetch } = useGetConversationsQuery();

  return {
    conversations: data?.data,
    isLoading,
    isError,
    refetch,
  };
};
