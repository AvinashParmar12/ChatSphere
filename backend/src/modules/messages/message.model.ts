// ==============================
// Imports
// ==============================

import {
  Schema,
  model,
} from "mongoose";

import {
  IMessage,
} from "./message.types";

// ==============================
// Message Schema
// ==============================

const messageSchema =
  new Schema<IMessage>(
    {
      conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
      },

      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      content: {
        type: String,
        required: true,
        trim: true,
      },

      readBy: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    {
      timestamps: true,
    }
  );

// ==============================
// Indexes
// ==============================

messageSchema.index({
  conversation: 1,
  createdAt: 1,
});

messageSchema.index({
  sender: 1,
});

// ==============================
// Message Model
// ==============================

export const Message =
  model<IMessage>(
    "Message",
    messageSchema
  );