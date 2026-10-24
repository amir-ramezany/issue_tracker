import { z } from "zod";
import { idSchema } from "../../common/schemas/id.schema";

export const issueParamsSchema = z.object({
  issueId: idSchema,
});

export const commentParamsSchema = z.object({
  commentId: idSchema,
});

// هم برای ساخت و هم برای ویرایش
export const commentBodySchema = z.object({
  body: z.string().trim().min(1).max(5000),
});

export type CommentBodyInput = z.infer<typeof commentBodySchema>;
