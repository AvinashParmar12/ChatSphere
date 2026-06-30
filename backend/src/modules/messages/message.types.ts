import { Document, Types } from "mongoose";

// ==============================
// Attachment Interface
// ==============================

export interface IAttachment {
  url?: string;

  publicId?: string;

  fileName?: string;

  mimeType?: string;

  size?: number;
}

// ==============================
// Message Type
// ==============================

export type MessageType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "file";

// ==============================
// Message Document Interface
// ==============================

export interface IMessage
  extends Document {
  conversation: Types.ObjectId;

  sender: Types.ObjectId;

  messageType: MessageType;

  content: string;

  attachment?: IAttachment;

  readBy: Types.ObjectId[];

  createdAt: Date;

  updatedAt: Date;
}