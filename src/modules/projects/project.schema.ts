import { z } from "zod";
import { idSchema, jsonIdSchema } from "../../common/schemas/id.schema";

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
  projectId: idSchema,
});
export const updateProjectSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(1000).optional(),
});

export const memberParamsSchema = projectIdParamsSchema.extend({
  userId: idSchema,
});

export const addMemberSchema = z.object({
  userId: jsonIdSchema,
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
