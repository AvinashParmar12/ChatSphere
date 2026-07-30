import { z } from "zod";

export const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .refine((val) => val.length >= 3, "Username cannot be empty or only spaces"),
  bio: z
    .string()
    .trim()
    .max(200, "Bio must be at most 200 characters")
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
