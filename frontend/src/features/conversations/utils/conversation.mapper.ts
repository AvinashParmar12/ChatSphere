import type { BackendConversation, ConversationItemData } from "../types/conversation.types";

export const formatMessageTime = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  
  // Reset time part of dates to compare days properly
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffTime = today.getTime() - compareDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Today: e.g. "10:30 AM"
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    // Yesterday
    return "Yesterday";
  } else if (diffDays < 7) {
    // Less than a week ago: e.g. "Mon"
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    // Longer: e.g. "May 12"
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
};

export const mapConversationToItem = (
  conversation: BackendConversation,
  currentUserId: string | undefined
): ConversationItemData => {
  const isGroup = conversation.isGroup;
  
  // Find the other participant in 1-on-1 chats
  const otherParticipant = conversation.participants.find(
    (p) => p._id !== currentUserId
  );
  
  // If self-chat, fall back to current user's profile
  const fallbackParticipant = conversation.participants[0];

  const name = isGroup
    ? (conversation.groupName || "Group Chat")
    : (otherParticipant?.username || fallbackParticipant?.username || "ChatSphere User");

  const avatarUrl = isGroup
    ? (conversation.groupAvatar || undefined)
    : (otherParticipant?.avatar || fallbackParticipant?.avatar || undefined);

  const lastMessage = conversation.lastMessage
    ? conversation.lastMessage.content
    : "No messages yet";

  const time = conversation.lastMessage
    ? formatMessageTime(conversation.lastMessage.createdAt)
    : formatMessageTime(conversation.createdAt);

  return {
    id: conversation._id,
    name,
    lastMessage,
    time,
    unreadCount: conversation.unreadCount,
    avatarUrl,
    isActive: false, // UI selection is not handled in this task
  };
};
