import { body } from "express-validator";

// ==============================
// Send Message Validation
// ==============================

export const sendMessageValidation = [
  body("conversationId")
    .notEmpty()
    .withMessage(
      "Conversation ID is required"
    )
    .isMongoId()
    .withMessage(
      "Invalid Conversation ID"
    ),

  body("content")
    .trim()
    .notEmpty()
    .withMessage(
      "Message content is required"
    )
    .isLength({
      max: 2000,
    })
    .withMessage(
      "Message cannot exceed 2000 characters"
    ),
];
