import { useRef, useLayoutEffect, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import EmptyMessages from "./EmptyMessages";
import type { Message } from "../types/message.types";
import type { User } from "@/features/auth/types/auth.types";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  isError: boolean;
  isFetchingMore: boolean;
  currentUser: User | null;
  onReachTop: () => void;
}

const MessageList = ({
  messages,
  isLoading,
  isError,
  isFetchingMore,
  currentUser,
  onReachTop,
}: MessageListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const previousScrollHeight = useRef<number>(0);
  const previousMessageCount = useRef<number>(0);
  const firstMessageId = useRef<string | null>(null);
  const isNearBottom = useRef<boolean>(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    // Detect if we are near the bottom (within 100px)
    isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100;

    // Detect top for infinite scroll
    if (el.scrollTop === 0) {
      onReachTop();
    }
  };

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || messages.length === 0) {
      previousMessageCount.current = messages.length;
      return;
    }

    const currentFirstId = messages[0]._id;

    // Prepending older messages
    if (firstMessageId.current && firstMessageId.current !== currentFirstId && previousMessageCount.current > 0) {
      const scrollDiff = el.scrollHeight - previousScrollHeight.current;
      el.scrollTop += scrollDiff;
    } 
    // Appending new messages
    else if (previousMessageCount.current > 0 && messages.length > previousMessageCount.current) {
      const lastMessage = messages[messages.length - 1];
      const isOwn = lastMessage.sender._id === currentUser?._id;
      
      if (isOwn || isNearBottom.current) {
        el.scrollTop = el.scrollHeight;
      }
    }
    // Initial load
    else if (previousMessageCount.current === 0 && messages.length > 0) {
      el.scrollTop = el.scrollHeight;
      isNearBottom.current = true;
    }

    previousScrollHeight.current = el.scrollHeight;
    previousMessageCount.current = messages.length;
    firstMessageId.current = currentFirstId;
  }, [messages, currentUser]);

  // Handle resizing or other unexpected layout shifts
  useEffect(() => {
    if (scrollRef.current) {
      previousScrollHeight.current = scrollRef.current.scrollHeight;
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
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
  // ===========================================================================
  console.log("Current User:", currentUser);
  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className="custom-scrollbar flex-1 overflow-y-auto p-4"
    >
      <div className="flex min-h-full flex-col justify-end">
        {isFetchingMore && (
          <div className="my-4 flex justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-blue-400"></div>
          </div>
        )}
        {messages.map((message) => {
          
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
