import { useSendMessageMutation } from "../api/message.api";

export const useSendMessage = () => {
  const [sendMessageMutation, { isLoading, error }] = useSendMessageMutation();

  return {
    sendMessage: sendMessageMutation,
    isLoading,
    error,
  };
};
