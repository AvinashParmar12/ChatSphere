// ==============================
// Imports
// ==============================

import {
  param,
} from "express-validator";

// ==============================
// Mark Notification Read Validation
// ==============================

export const markNotificationReadValidation = [
  param("notificationId")
    .isMongoId()
    .withMessage(
      "Invalid notification ID"
    ),
];