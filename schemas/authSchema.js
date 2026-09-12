import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Code must be exactly 6 digits"),
  newPassword: z.string().min(8)
});