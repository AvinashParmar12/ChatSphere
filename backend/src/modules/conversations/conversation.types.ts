// ==============================
// Imports
// ==============================

import { Document, Types } from "mongoose";

// ==============================
// Conversation Interface
// ==============================

export interface IConversation {
  participants: Types.ObjectId[];

  lastMessage?: Types.ObjectId | null;

  lastMessageAt?: Date | null;

  isGroup: boolean;

groupName?: string;

groupAvatar?: string;

groupAdmin?: Types.ObjectId;
}

// ==============================
// Conversation Document
// ==============================

export interface IConversationDocument
  extends IConversation,
    Document {
  createdAt: Date;

  updatedAt: Date;
}