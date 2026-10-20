import { z } from "zod";

export const projectParamsSchema = z.object({
  projectId: z.coerce.number().int().positive().max(2147483647),
});

export const issueParamsSchema = z.object({
  issueId: z.coerce.number().int().positive().max(2147483647),
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
  assigneeId: z.number().int().positive().max(2147483647).nullable().optional(),
});

export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
