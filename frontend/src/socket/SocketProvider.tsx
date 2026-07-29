import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { connectSocket, disconnectSocket, socket } from "./socket";
import { messageApi } from "@/features/messages/api/message.api";
import { conversationApi } from "@/features/conversations/api/conversation.api";
import type { Message } from "@/features/messages/types/message.types";
import { notificationApi } from "@/features/notifications/api/notification.api";
import type { BackendNotification } from "@/features/notifications/types/notification.types";
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
      const isCurrentUser = message.sender._id === currentUser?._id;

      // Normalize conversation ID to handle both string and populated object
      const conversationIdStr =
        typeof message.conversation === "object" && message.conversation !== null
          ? (message.conversation as any)._id
          : message.conversation;

      // 1. Update Messages Cache (only if currently viewing this conversation AND not sent by current user)
      if (!isCurrentUser && conversationIdStr === selectedConversationId) {
        dispatch(
          messageApi.util.updateQueryData(
            "getMessages",
            { conversationId: selectedConversationId, page: 1 },
            (draft) => {
              // Avoid duplicates
              const exists = draft.data.messages.some(
                (m) => m._id === message._id
              );
              if (!exists) {
                draft.data.messages.unshift(message);
              }
            }
          )
        );

        // Instantly mark as read since the user is actively viewing this conversation
        dispatch(messageApi.endpoints.markConversationAsRead.initiate(conversationIdStr));
      }

      // 2. Update Conversations List Cache (for ALL messages)
      dispatch(
        conversationApi.util.updateQueryData(
          "getConversations",
          undefined,
          (draft) => {
            const index = draft.data.findIndex(
              (c) => c._id === conversationIdStr
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
              
              // Update timestamp using lastMessageAt as requested
              conversation.lastMessageAt = message.createdAt;

              // Update unread count only if not current user AND not actively selected
              if (!isCurrentUser && conversationIdStr !== selectedConversationId) {
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

    const handleMessageRead = ({ conversationId, readerUserId }: { conversationId: string; readerUserId: string }) => {
      console.log("[SOCKET] message_read received", { conversationId, readerUserId });
      console.log("[CACHE] Updating messages cache");
      
      // 3. Update message readBy array
      dispatch(
        messageApi.util.updateQueryData(
          "getMessages",
          { conversationId, page: 1 },
          (draft) => {
            draft.data.messages.forEach((msg) => {
              // Only push readerUserId if sender !== readerUserId and not already inside readBy
              if (
                msg.sender._id !== readerUserId &&
                !msg.readBy?.includes(readerUserId)
              ) {
                msg.readBy = msg.readBy || [];
                msg.readBy.push(readerUserId);
              }
            });
          }
        )
      );
      
      console.log("[CACHE] Messages cache updated");
    };

    const handleNewNotification = (notification: BackendNotification) => {
      dispatch(
        notificationApi.util.updateQueryData(
          "getNotifications",
          undefined,
          (draft) => {
            const exists = draft.data.some((n) => n._id === notification._id);
            if (!exists) {
              draft.data.unshift(notification);
            }
          }
        )
      );
    };

    socket.on("new_message", handleNewMessage);
    socket.on("message_read", handleMessageRead);
    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_read", handleMessageRead);
      socket.off("notification:new", handleNewNotification);
    };
  }, [isAuthenticated, selectedConversationId, currentUser?._id, dispatch]);

  return <>{children}</>;
};
