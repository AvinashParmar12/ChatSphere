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
}

// ==============================
// Conversation Document
// ==============================

export interface IConversationDocument
  extends IConversation,
    Document {}