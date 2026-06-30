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


// ==============================
// Send Media Message Validation
// ==============================

export const sendMediaMessageValidation = [
  body("conversationId")
    .notEmpty()
    .withMessage("Conversation ID is required")
    .isMongoId()
    .withMessage("Invalid Conversation ID"),

  body("messageType")
    .notEmpty()
    .withMessage("Message type is required")
    .isIn([
      "image",
      "video",
      "audio",
      "file",
    ])
    .withMessage("Invalid message type"),

  body("content")
    .optional()
    .trim()
    .isLength({
      max: 2000,
    })
    .withMessage(
      "Caption cannot exceed 2000 characters"
    ),
];