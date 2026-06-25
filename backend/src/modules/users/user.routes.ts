import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";
import { updateProfileValidation } from "./user.validation";
import { updateUserProfile, searchAllUsers, updateUserAvatar, getOnlineStatus } from "./user.controller";
import upload from "../../middlewares/upload.middleware";

const router = Router();

// ==============================
// Get User Status
// ==============================
router.get(
  "/status/:userId",
  authMiddleware,
  getOnlineStatus
);

// ==============================
// Search Users
// ==============================
router.get(
  "/search",
  authMiddleware,
  searchAllUsers
);



// ==============================
// Update User Profile
// ==============================
router.patch(
  "/profile",
  authMiddleware,
  updateProfileValidation,
  validateRequest,
  updateUserProfile
);

// ==============================
// Update User Avatar
// ==============================
router.patch(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  updateUserAvatar
);

export default router;