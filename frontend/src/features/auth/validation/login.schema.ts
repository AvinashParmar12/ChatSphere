import { z } from "zod";

// ==============================
// Login Schema
// ==============================

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

// ==============================
// Login Form Type
// ==============================

export type LoginFormData =
  z.infer<typeof loginSchema>;