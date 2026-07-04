// ==============================
// Imports
// ==============================

import { Document, Types } from "mongoose";

// ==============================
// Notification Type
// ==============================

export type NotificationType =
  | "MESSAGE"
  | "GROUP_ADD"
  | "GROUP_REMOVE"
  | "GROUP_RENAME"
  | "GROUP_AVATAR"
  | "GROUP_LEAVE"
  | "MENTION";



// ==============================
// Notification Interface
// ==============================

export interface INotification {
  receiver: Types.ObjectId;

  sender?: Types.ObjectId;

  conversation?: Types.ObjectId;

  type: NotificationType;

  title: string;

  message: string;

  isRead: boolean;
}

// ==============================
// Notification Document
// ==============================

export interface INotificationDocument
  extends INotification,
    Document {
  createdAt: Date;

  updatedAt: Date;
}