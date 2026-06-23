import { Router } from "express";
import { register, login } from "./auth.controller";
import { registerValidation, loginValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";
import authMiddleware from "../../middlewares/auth.middleware";
import { getMe } from "./auth.controller";

const router = Router();

// ==============================
// User Registration
// ==============================
router.post(
  "/register",
  registerValidation,
  validateRequest,
  register
);

// ==============================
// User Login
// ==============================
router.post(
  "/login",
  loginValidation,
  validateRequest,
  login
);

// ==============================
// Get Current Logged-in User
// ==============================
router.get(
  "/me",
  authMiddleware,
  getMe
);

export default router;