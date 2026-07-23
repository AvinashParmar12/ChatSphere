import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { connectSocket, disconnectSocket, socket } from "./socket";
import { messageApi } from "@/features/messages/api/message.api";
import { conversationApi } from "@/features/conversations/api/conversation.api";
import type { Message } from "@/features/messages/types/message.types";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const currentUser = useAppSelector((state) => state.auth.user);
  const selectedConversationId = useAppSelector(
    (state) => state.conversations.selectedConversationId
  );
  const dispatch = useAppDispatch();

  // Handle Authentication and Connection Lifecycle
  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  // Handle Real-Time Events
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleNewMessage = (message: Message) => {
      // Ignore messages sent by the current user
      if (message.sender._id === currentUser?._id) {
        return;
      }

      // 1. Update Messages Cache (only if currently viewing this conversation)
      if (message.conversation === selectedConversationId) {
        dispatch(
          messageApi.util.updateQueryData(
            "getMessages",
            { conversationId: selectedConversationId },
            (draft) => {
              // Avoid duplicates
              const exists = draft.data.messages.some(
                (m) => m._id === message._id
              );
              if (!exists) {
                draft.data.messages.push(message);
              }
            }
          )
        );
      }

      // 2. Update Conversations List Cache
      dispatch(
        conversationApi.util.updateQueryData(
          "getConversations",
          undefined,
          (draft) => {
            const index = draft.data.findIndex(
              (c) => c._id === message.conversation
            );

            if (index !== -1) {
              const conversation = draft.data[index];

              // Avoid duplicate event processing
              if (conversation.lastMessage?._id === message._id) {
                return;
              }

              // Update lastMessage
              conversation.lastMessage = {
                _id: message._id,
                content: message.content,
                sender: {
                  _id: message.sender._id,
                  username: message.sender.username,
                  avatar: message.sender.avatar,
                },
                createdAt: message.createdAt,
              };
              
              // Update timestamp
              conversation.updatedAt = message.createdAt;

              // Update unread count
              if (message.conversation !== selectedConversationId) {
                conversation.unreadCount = (conversation.unreadCount || 0) + 1;
              }

              // Move to top
              draft.data.splice(index, 1);
              draft.data.unshift(conversation);
            }
          }
        )
      );
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [isAuthenticated, selectedConversationId, currentUser?._id, dispatch]);

  return <>{children}</>;
};
