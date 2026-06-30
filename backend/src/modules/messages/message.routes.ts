// ==============================
// Imports
// ==============================

import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";
import mediaUpload from "../../middlewares/mediaUpload.middleware";
import {
  sendMessageValidation,
  sendMediaMessageValidation,
} from "./message.validation";
import {
  sendMessageController,
  sendMediaMessageController,
  getConversationMessagesController,
  markConversationRead,
} from "./message.controller";

// ==============================
// Router
// ==============================

const router = Router();

// ==============================
// Message Routes
// ==============================

router.get(
  "/:conversationId",
  authMiddleware,
  getConversationMessagesController
);

router.post(
  "/",
  authMiddleware,
  sendMessageValidation,
  validateRequest,
  sendMessageController
);

// ==============================
// Send Media Message
// ==============================
router.post(
  "/media",
  authMiddleware,
  mediaUpload.single("attachment"),
  sendMediaMessageValidation,
  validateRequest,
  sendMediaMessageController
);

// ==============================
// Mark Conversation As Read
router.patch(
  "/:conversationId/read",
  authMiddleware,
  markConversationRead
);


// ==============================
// Export Router
// ==============================

export default router;