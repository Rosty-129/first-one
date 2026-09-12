import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  phone: z.string().min(8),
  location: z.string().min(1),
  date: z.string()
});

export const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Code must be exactly 6 digits")
});