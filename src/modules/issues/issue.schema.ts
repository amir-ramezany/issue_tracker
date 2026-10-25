import { z } from "zod";
import { idSchema, jsonIdSchema } from "../../common/schemas/id.schema";

export const projectParamsSchema = z.object({
  projectId: idSchema,
});

export const issueParamsSchema = z.object({
  issueId: idSchema,
});

const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const createIssueSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).optional(),
  priority: prioritySchema.optional(),
});

const statusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const updateIssueSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(5000).optional(),
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  // null یعنی assignee را بردار؛ نفرستادن یعنی تغییر نده
  assigneeId: jsonIdSchema.nullable().optional(),
});

export const listIssuesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  assigneeId: idSchema.optional(),
  reporterId: idSchema.optional(),
  search: z.string().trim().min(1).max(100).optional(),
  // فقط این فیلدها اجازه‌ی مرتب‌سازی دارند؛ نام ستون از کلاینت مستقیم استفاده نمی‌شود
  sortBy: z
    .enum(["number", "title", "priority", "status", "createdAt", "updatedAt"])
    .default("number"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type ListIssuesQuery = z.infer<typeof listIssuesQuerySchema>;

export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
