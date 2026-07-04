// ==============================
// Imports
// ==============================

import { Types } from "mongoose";
import { Notification } from "./notification.model";
import {
  INotificationDocument,
  NotificationType,
} from "./notification.types";

// ==============================
// Create Notification
// ==============================

export const createNotification =
  async ({
    receiver,
    sender,
    conversation,
    type,
    title,
    message,
  }: {
    receiver: Types.ObjectId | string;

    sender?: Types.ObjectId | string;

    conversation?:
      | Types.ObjectId
      | string;

    type: NotificationType;

    title: string;

    message: string;
  }): Promise<INotificationDocument> => {
    return await Notification.create({
      receiver,
      sender,
      conversation,
      type,
      title,
      message,
    });
  };

// ==============================
// Notify Specific Users
// ==============================

export const notifyUsers = 
  async ({
  users,
  sender,
  conversation,
  type,
  title,
  message,
  excludeUsers = [],
}: {
  users: (Types.ObjectId | string)[];

  sender?: Types.ObjectId | string;

  conversation?: Types.ObjectId | string;

  type: NotificationType;

  title: string;

  message: string;

  excludeUsers?: (
    | Types.ObjectId
    | string
  )[];
}): Promise<void> => {
  const filteredUsers =
  users.filter(
    (user) =>
      !excludeUsers.some(
        (excludedUser) =>
          excludedUser.toString() ===
          user.toString()
      )
  );

await Promise.all(
  filteredUsers.map((receiver) =>
    createNotification({
      receiver,
      sender,
      conversation,
      type,
      title,
      message,
    })
  )
);
};

// ==============================
// Notify Group Participants
// ==============================

export const notifyGroupParticipants = 
  async ({
  participants,
  sender,
  conversation,
  type,
  title,
  message,
  excludeUsers = [],
}: {
  participants: (Types.ObjectId | string)[];

  sender?: Types.ObjectId | string;

  conversation?: Types.ObjectId | string;

  type: NotificationType;

  title: string;

  message: string;

  excludeUsers?: (
  | Types.ObjectId
  | string
)[];
}): Promise<void> => {
  await notifyUsers({
    users: participants,
    sender,
    conversation,
    type,
    title,
    message,
  });
};

// ==============================
// Get User Notifications
// ==============================

export const getUserNotifications =
  async (
    userId: string
  ) => {
    return await Notification.find({
      receiver: userId,
    })
      .populate(
        "sender",
        "username avatar"
      )
      .populate(
        "conversation",
        "isGroup groupName groupAvatar"
      )
      .sort({
        createdAt: -1,
      });
  };

// ==============================
// Mark Notification Read
// ==============================

export const markNotificationRead =
  async (
    notificationId: string,
    userId: string
  ) => {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: notificationId,
          receiver: userId,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    return notification;
  };

// ==============================
// Mark All Notifications Read
// ==============================

export const markAllNotificationsRead =
  async (
    userId: string
  ) => {
    await Notification.updateMany(
      {
        receiver: userId,
        isRead: false,
      },
      {
        isRead: true,
      }
    );
  };