import { z } from "zod";

export const updateMeSchema = z.object({
  email: z.email(),
});

export type UpdateMeInput = z.infer<typeof updateMeSchema>;
