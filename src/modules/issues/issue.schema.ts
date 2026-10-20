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

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
