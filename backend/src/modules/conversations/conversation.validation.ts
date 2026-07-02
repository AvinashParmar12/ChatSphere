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
    .isArray({ min: 1 })
    .withMessage(
      "Group must contain at least 2 participants"
    ),

  body("participants.*")
    .isMongoId()
    .withMessage("Invalid participant ID"),
];

// ==============================
// Rename Group Validation
// ==============================

export const renameGroupValidation = [
  body("groupName")
    .trim()
    .notEmpty()
    .withMessage(
      "Group name is required"
    )
    .isLength({
      min: 3,
      max: 50,
    })
    .withMessage(
      "Group name must be between 3 and 50 characters"
    ),
];

// ==============================
// Add Group Members Validation
// ==============================

export const addGroupMembersValidation = [
  body("participants")
    .isArray({ min: 1 })
    .withMessage(
      "At least one participant is required"
    ),

  body("participants.*")
    .isMongoId()
    .withMessage(
      "Invalid participant ID"
    ),
];

// ==============================
// Remove Group Members Validation
// ==============================

export const removeGroupMembersValidation =
  [
    body("participants")
      .isArray({ min: 1 })
      .withMessage(
        "At least one participant is required"
      ),

    body("participants.*")
      .isMongoId()
      .withMessage(
        "Invalid participant ID"
      ),
  ];