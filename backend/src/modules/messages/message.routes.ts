// ==============================
// Imports
// ==============================

import { Router } from "express";

import authMiddleware from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";

import { sendMessageValidation } from "./message.validation";
import { sendMessageController, getConversationMessagesController, markConversationRead, } from "./message.controller";

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