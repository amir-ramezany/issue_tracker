import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  // bcrypt فقط ۷۲ بایت اول رمز را در نظر می‌گیرد
  password: z.string().min(8).max(72),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type RegisterInput = z.infer<typeof registerSchema>;
