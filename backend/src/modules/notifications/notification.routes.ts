// ==============================
// Imports
// ==============================

import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";

import {
  getNotificationsController,
  markNotificationReadController,
  markAllNotificationsReadController,
} from "./notification.controller";

import {
  markNotificationReadValidation,
} from "./notification.validation";

// ==============================
// Router
// ==============================

const router = Router();

// ==============================
// Get Notifications
// ==============================

router.get(
  "/",
  authMiddleware,
  getNotificationsController
);

// ==============================
// Mark Notification Read
// ==============================

router.patch(
  "/:notificationId/read",
  authMiddleware,
  markNotificationReadValidation,
  validateRequest,
  markNotificationReadController
);

// ==============================
// Mark All Notifications Read
// ==============================

router.patch(
  "/read-all",
  authMiddleware,
  markAllNotificationsReadController
);

export default router;