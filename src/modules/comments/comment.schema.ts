import { z } from "zod";

export const issueParamsSchema = z.object({
  issueId: z.coerce.number().int().positive().max(2147483647),
});

export const commentParamsSchema = z.object({
  commentId: z.coerce.number().int().positive().max(2147483647),
});

// هم برای ساخت و هم برای ویرایش
export const commentBodySchema = z.object({
  body: z.string().trim().min(1).max(5000),
});

export type CommentBodyInput = z.infer<typeof commentBodySchema>;
