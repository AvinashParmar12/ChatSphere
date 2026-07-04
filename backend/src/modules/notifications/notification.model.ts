// ==============================
// Imports
// ==============================

import {
  Schema,
  model,
} from "mongoose";

import {
  INotificationDocument,
} from "./notification.types";

// ==============================
// Notification Schema
// ==============================

const notificationSchema =
  new Schema<INotificationDocument>(
    {
      receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation",
      },

      type: {
        type: String,
        enum: [
          "MESSAGE",
          "GROUP_ADD",
          "GROUP_REMOVE",
          "GROUP_RENAME",
          "GROUP_AVATAR",
          "MENTION",
        ],
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      message: {
        type: String,
        required: true,
        trim: true,
      },

      isRead: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

// ==============================
// Indexes
// ==============================

// User's notifications
notificationSchema.index({
  receiver: 1,
  createdAt: -1,
});

// Unread notifications
notificationSchema.index({
  receiver: 1,
  isRead: 1,
});

// ==============================
// Notification Model
// ==============================

export const Notification =
  model<INotificationDocument>(
    "Notification",
    notificationSchema
  );