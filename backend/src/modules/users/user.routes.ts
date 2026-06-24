import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";
import { updateProfileValidation } from "./user.validation";
import { updateUserProfile, searchAllUsers } from "./user.controller";

const router = Router();

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

export default router;