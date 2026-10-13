import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  // bcrypt فقط ۷۲ بایت اول رمز را در نظر می‌گیرد
  password: z.string().min(8).max(72),
});

export type RegisterInput = z.infer<typeof registerSchema>;
