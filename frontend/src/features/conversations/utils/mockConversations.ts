import { type ConversationItemData } from "../types/conversation.types";

export const mockConversations: ConversationItemData[] = [
  {
    id: "1",
    name: "Engineering Team",
    lastMessage: "Are we still on for the standup?",
    time: "10:30 AM",
    unreadCount: 3,
  },
  {
    id: "2",
    name: "Design Sync",
    lastMessage: "I've uploaded the new assets.",
    time: "Yesterday",
  },
  {
    id: "3",
    name: "Sarah Jenkins",
    lastMessage: "Thanks for the help!",
    time: "Mon",
    isActive: true,
  },
  {
    id: "4",
    name: "General Chat",
    lastMessage: "Welcome to the new members!",
    time: "May 12",
  },
];
