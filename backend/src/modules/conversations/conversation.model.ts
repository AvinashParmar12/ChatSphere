// ==============================
// Imports
// ==============================

import { Schema, model } from "mongoose";
import { IConversationDocument } from "./conversation.types";

// ==============================
// Conversation Schema
// ==============================

const conversationSchema =
  new Schema<IConversationDocument>(
    {
      participants: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],

      lastMessage: {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: null,
      },

      lastMessageAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

// ==============================
// Indexes
// ==============================

conversationSchema.index({
  participants: 1,
  lastMessageAt: -1,
});

// ==============================
// Conversation Model
// ==============================

export const Conversation = model<IConversationDocument>(
  "Conversation",
  conversationSchema
);