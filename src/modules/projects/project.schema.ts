import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1).max(100),
  // حروف بزرگ و عدد، ۲ تا ۱۰ کاراکتر، با حرف شروع می‌شود. مثل WEB یا API2
  key: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[A-Z][A-Z0-9]{1,9}$/,
      "Key must be 2-10 letters or digits, starting with a letter",
    ),
  description: z.string().trim().max(1000).optional(),
});
// آیدی در URL رشته است؛ coerce آن را به عدد تبدیل می‌کند. max برای محدوده‌ی Int دیتابیس است
export const projectIdParamsSchema = z.object({
  projectId: z.coerce.number().int().positive().max(2147483647),
});
export const updateProjectSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(1000).optional(),
});

export const memberParamsSchema = projectIdParamsSchema.extend({
  userId: z.coerce.number().int().positive().max(2147483647),
});

export const addMemberSchema = z.object({
  userId: z.number().int().positive().max(2147483647),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
