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
      isGroup: {
        type: Boolean,
        default: false,
      },

      groupName: {
        type: String,
        trim: true,
      },

      groupAvatar: {
        type: String,
        default: "",
      },

      groupAdmin: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

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