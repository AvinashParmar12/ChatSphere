// ==============================
// Imports
// ==============================

import { Request, Response } from "express";

import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";

import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "./notification.service";

// ==============================
// Get Notifications
// ==============================

export const getNotificationsController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const notifications =
        await getUserNotifications(
          req.userId as string
        );

      res.status(200).json(
        new ApiResponse(
          "Notifications fetched successfully",
          notifications
        )
      );
    }
  );

// ==============================
// Mark Notification Read
// ==============================

export const markNotificationReadController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      const notification =
        await markNotificationRead(
          req.params.notificationId as string,
          req.userId as string
        );

      res.status(200).json(
        new ApiResponse(
          "Notification marked as read",
          notification
        )
      );
    }
  );

// ==============================
// Mark All Notifications Read
// ==============================

export const markAllNotificationsReadController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {
      await markAllNotificationsRead(
        req.userId as string
      );

      res.status(200).json(
        new ApiResponse(
          "All notifications marked as read"
        )
      );
    }
  );