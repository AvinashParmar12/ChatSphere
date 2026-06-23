import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  
  username: string;
  email: string;
  password: string;

  avatar?: string;
  bio?: string;

  isVerified: boolean;

  lastSeen: Date;

  refreshToken?: string;

  createdAt?: Date;
  updatedAt?: Date;
}