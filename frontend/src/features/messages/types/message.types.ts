import { type User } from "@/features/auth/types/auth.types";

export interface Pagination {
  page: number;
  limit: number;
  totalMessages: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: User;
  messageType: "text" | "image" | "video" | "audio" | "file" | "system";
  content: string;
  attachment?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  success: boolean;
  message: string;
  data: Message;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
}

export interface MessageListResponse {
  success: boolean;
  message: string;
  data: {
    messages: Message[];
    pagination: Pagination;
  };
}
