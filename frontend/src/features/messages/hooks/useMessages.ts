import { useAppSelector } from "@/store/hooks";
import { useGetMessagesQuery } from "../api/message.api";

export const useMessages = () => {
  const selectedConversationId = useAppSelector(
    (state) => state.conversations.selectedConversationId
  );
  
  const { data, isLoading, isError, refetch } = useGetMessagesQuery(
    { conversationId: selectedConversationId as string },
    { skip: !selectedConversationId }
  );

  const messages = data?.data?.messages || [];

  return {
    messages,
    pagination: data?.data?.pagination,
    isLoading,
    isError,
    refetch,
  };
};

