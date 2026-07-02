// ==============================
// Imports
// ==============================

import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";
import {
  createConversationValidation,
  createGroupValidation,
  renameGroupValidation
} from "./conversation.validation";
import {
  createNewConversationController,
  createGroupConversationController,
  getConversationsController,
  getConversationByIdController,
  getGroupDetailsController,
  renameGroupController,
} from "./conversation.controller";

// ==============================
// Router
// ==============================

const router = Router();

// ==============================
// Create Conversation
// ==============================

router.post(
  "/",
  authMiddleware,
  createConversationValidation,
  validateRequest,
  createNewConversationController
);

// ==============================
// Create Group Conversation
// ==============================

router.post(
  "/group",
  authMiddleware,
  createGroupValidation,
  validateRequest,
  createGroupConversationController
);

// ==============================
// Get Group Details
// ==============================

router.get(
  "/group/:groupId",
  authMiddleware,
  getGroupDetailsController
);

// ==============================
// Rename Group
// ==============================

router.patch(
  "/group/:groupId/name",
  authMiddleware,
  renameGroupValidation,
  validateRequest,
  renameGroupController
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
// Get Conversation By ID
// ==============================

router.get(
  "/:conversationId",
  authMiddleware,
  getConversationByIdController
);

// ==============================
// Export Router
// ==============================

export default router;
