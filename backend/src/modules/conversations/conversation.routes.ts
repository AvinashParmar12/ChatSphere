// ==============================
// Imports
// ==============================

import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";
import { createConversationValidation } from "./conversation.validation";
import {
  createNewConversationController,
  getConversationsController,
  getConversationByIdController,
} from "./conversation.controller";

// ==============================
// Router
// ==============================

const router = Router();

// ==============================
// Conversation Routes
// ==============================

router.post(
  "/",
  authMiddleware,
  createConversationValidation,
  validateRequest,
  createNewConversationController
);

router.get(
  "/:conversationId",
  authMiddleware,
  getConversationByIdController
);

// ==============================
// Get User Conversations
// ==============================
router.get(
  "/",
  authMiddleware,
  getConversationsController
);



// ==============================
// Export Router
// ==============================

export default router;
