// ==============================
// Imports
// ==============================

import { body } from "express-validator";

// ==============================
// Create Conversation Validation
// ==============================
export const createConversationValidation = [
  body("receiverId")
    .notEmpty()
    .withMessage("Receiver ID is required")
    .isMongoId()
    .withMessage("Invalid Receiver ID"),
];

// ==============================
// Create Group Validation
// ==============================

export const createGroupValidation = [
  body("groupName")
    .trim()
    .notEmpty()
    .withMessage("Group name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "Group name must be between 3 and 50 characters"
    ),

  body("participants")
    .isArray({ min: 2 })
    .withMessage(
      "Group must contain at least 2 participants"
    ),

  body("participants.*")
    .isMongoId()
    .withMessage("Invalid participant ID"),
];