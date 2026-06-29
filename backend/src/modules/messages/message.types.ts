import { Document, Types } from "mongoose";

// ==============================
// Message Document Interface
// ==============================

export interface IMessage
  extends Document {
  conversation: Types.ObjectId;

  sender: Types.ObjectId;

  content: string;

  readBy: Types.ObjectId[];

  createdAt: Date;

  updatedAt: Date;
}