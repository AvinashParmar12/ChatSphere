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