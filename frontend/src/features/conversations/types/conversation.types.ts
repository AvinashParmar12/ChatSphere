import { type User } from "@/features/auth/types/auth.types";

export interface ConversationItemData {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  avatarUrl?: string;
  isActive?: boolean;
}

export interface Participant {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface LastMessage {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface BackendConversation {
  _id: string;
  isGroup: boolean;
  groupName: string | null;
  groupAvatar: string | null;
  participants: Participant[];
  lastMessage?: LastMessage | null;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationListResponse {
  success: boolean;
  message: string;
  data: BackendConversation[];
}
