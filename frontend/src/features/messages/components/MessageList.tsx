import { useEffect, useRef } from "react";
import { useAppSelector } from "@/store/hooks";
import { useMessages } from "../hooks/useMessages";
import MessageBubble from "./MessageBubble";
import EmptyMessages from "./EmptyMessages";

const MessageList = () => {
  const { messages, isLoading, isError } = useMessages();
  const currentUser = useAppSelector((state) => state.auth.user);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-center">
        <p className="text-sm text-red-400">Failed to load messages</p>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return <EmptyMessages />;
  }

  // Reverse messages if backend sends them newest-first and we want them newest-at-bottom
  // In `conversation.service.ts` earlier, we saw `.sort({ lastMessageAt: -1 })` for conversations, but usually messages are returned newest first in APIs (or oldest first). Let's render oldest first (assuming array order is chronological) and auto-scroll. If they are in reverse chronological order, we would need to slice and reverse. The plan said "Newest messages should appear at bottom", so standard map is fine.

  // We need to reverse them here because the backend API usually returns limit=20 sorted by createdAt DESC for pagination. 
  // We will assume backend returns them DESC (newest at index 0) so we reverse for rendering.
  const displayMessages = [...messages].reverse();

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 custom-scrollbar"
    >
      <div className="flex flex-col justify-end min-h-full">
        {displayMessages.map((message) => {
          const isOwnMessage = message.sender._id === currentUser?._id;
          return (
            <MessageBubble
              key={message._id}
              message={message}
              isOwnMessage={isOwnMessage}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MessageList;
