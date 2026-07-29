import { useState, useEffect, useRef } from "react";

import { useAppSelector, useAppDispatch } from "@/store/hooks";

import MessageList from "./MessageList";
import TypingIndicator from "./TypingIndicator";

import { useMessages } from "../hooks/useMessages";
import { useSendMessage } from "../hooks/useSendMessage";
import { useMarkConversationAsReadMutation } from "../api/message.api";

import { conversationApi } from "@/features/conversations/api/conversation.api";
import GroupHeaderMenu from "@/features/groups/components/GroupHeaderMenu";

import { socket } from "@/socket/socket";
const ChatWindow = () => {
  const selectedConversation = useAppSelector(
    (state) => state.conversations.selectedConversation
  );

  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [messageText, setMessageText] = useState("");
  const { sendMessage, isLoading } = useSendMessage();
  const { messages, isLoading: messagesLoading, isFetchingMore, isError, fetchMore } = useMessages();
  const [markConversationAsRead] = useMarkConversationAsReadMutation();

  // Typing State
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTyping = useRef(false);

  // Clear typing state and mark as read when conversation changes
  useEffect(() => {
    setTypingUsers(new Map());
    isTyping.current = false;
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    if (selectedConversation) {
      console.log("[READ] Calling PATCH", selectedConversation._id);
      markConversationAsRead(selectedConversation._id)
        .unwrap()
        .then(() => {
          console.log("[READ] PATCH Success");
          // Immediately set unreadCount to 0 in cache
          dispatch(
            conversationApi.util.updateQueryData(
              "getConversations",
              undefined,
              (draft) => {
                const conv = draft.data.find(
                  (c) => c._id === selectedConversation._id
                );
                if (conv) conv.unreadCount = 0;
              }
            )
          );
        })
        .catch((error) => {
          console.log("[READ] PATCH Error", error);
        });
    }
  }, [selectedConversation?._id, markConversationAsRead, dispatch]);

  // Listen for Typing Events
  useEffect(() => {
    if (!selectedConversation) return;

    const handleTypingStart = ({ conversationId, userId }: { conversationId: string, userId: string }) => {
      if (conversationId !== selectedConversation._id) return;
      if (userId === currentUser?._id) return;

      const participant = selectedConversation.participants.find(p => p._id === userId);
      if (participant) {
        setTypingUsers(prev => {
          const newMap = new Map(prev);
          newMap.set(userId, participant.username);
          return newMap;
        });
      }
    };

    const handleTypingStop = ({ conversationId, userId }: { conversationId: string, userId: string }) => {
      if (conversationId !== selectedConversation._id) return;

      setTypingUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(userId);
        return newMap;
      });
    };

    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);

    return () => {
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
    };
  }, [selectedConversation, currentUser?._id]);

  if (!selectedConversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center text-slate-400">
        <p>Select a conversation</p>
      </div>
    );
  }

  const isGroup = selectedConversation.isGroup;

  const otherParticipant = selectedConversation.participants.find(
    (p) => p._id !== currentUser?._id
  );
  const fallbackParticipant = selectedConversation.participants[0];

  const name = isGroup
    ? (selectedConversation.groupName || "Group Chat")
    : (otherParticipant?.username || fallbackParticipant?.username || "ChatSphere User");

  const avatarUrl = isGroup
    ? (selectedConversation.groupAvatar || undefined)
    : (otherParticipant?.avatar || fallbackParticipant?.avatar || undefined);

  const stopTyping = () => {
    if (isTyping.current) {
      socket.emit("typing:stop", { conversationId: selectedConversation._id });
      isTyping.current = false;
    }
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
  };

  const handleSend = async () => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) return;

    try {
      stopTyping();
      await sendMessage({
        conversationId: selectedConversation._id,
        content: trimmed,
      }).unwrap();

      setMessageText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageText(e.target.value);

    if (!isTyping.current) {
      socket.emit("typing:start", { conversationId: selectedConversation._id });
      isTyping.current = true;
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  const isSendDisabled = isLoading || !messageText.trim();

  return (
    <div className="flex h-full flex-col bg-slate-900/40">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/40 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-white overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs tracking-wider">
                {name.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">{name}</h3>
          </div>
        </div>

        {/* Group Actions */}
        {isGroup && (
          <GroupHeaderMenu />
        )}
      </div>

      {/* Message List */}
      <MessageList
        messages={messages}
        isLoading={messagesLoading}
        isError={isError}
        isFetchingMore={isFetchingMore}
        currentUser={currentUser}
        onReachTop={fetchMore}
      />

      {/* Composer */}
      <div className="border-t border-slate-800/40 p-4">
        {/* Typing Indicator */}
        <div className="mb-2 h-6">
          <TypingIndicator users={Array.from(typingUsers.values())} />
        </div>
        <div className="flex items-end gap-2 rounded-2xl bg-slate-800/50 p-2 border border-slate-700/50">
          <textarea
            placeholder="Type a message..."
            value={messageText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 custom-scrollbar"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isSendDisabled}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-0.5 mr-0.5"
          >
            <svg
              className="h-4 w-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
