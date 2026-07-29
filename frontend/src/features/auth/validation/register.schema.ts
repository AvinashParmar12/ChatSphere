import { z } from "zod";

// ==============================
// Register Schema
// ==============================

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// ==============================
// Register Form Type
// ==============================

export type RegisterFormData = z.infer<typeof registerSchema>;
