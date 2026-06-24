import { body } from "express-validator";

// ==============================
// Update User Profile Validation
// ==============================
export const updateProfileValidation = [
  body("username")
    .optional()
    .isLength({ min: 3 })
    .withMessage(
      "Username must be at least 3 characters"
    ),

  body("bio")
    .optional()
    .isLength({ max: 200 })
    .withMessage(
      "Bio cannot exceed 200 characters"
    ),
];