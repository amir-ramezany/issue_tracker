import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "../errors/appError";

export const validateBody =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const issue = result.error.issues[0];
      const field = issue.path.join(".");

      throw new AppError(
        400,
        "VALIDATION_ERROR",
        field ? `${field}: ${issue.message}` : issue.message,
      );
    }

    req.body = result.data; // داده‌ی تمیز (فیلدهای ناشناس حذف شده‌اند)
    next();
  };
