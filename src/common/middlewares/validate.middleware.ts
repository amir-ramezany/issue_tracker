import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "../errors/appError";

function check(schema: ZodType, data: unknown) {
  const result = schema.safeParse(data);

  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue.path.join(".");
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      field ? `${field}: ${issue.message}` : issue.message,
    );
  }

  return result.data; // داده‌ی تمیز (فیلدهای ناشناس حذف شده‌اند)
}

export const validateBody =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    // اگر بدنه‌ای نیامده باشد req.body خالی است؛ با {} پیام خطای فیلدها را می‌گیریم
    req.body = check(schema, req.body ?? {});
    next();
  };

// پارامترهای URL (مثل :projectId) را چک می‌کند
export const validateParams =
  (schema: ZodType): RequestHandler =>
  (req, _res, next) => {
    check(schema, req.params);
    next();
  };

// query string را چک می‌کند. در Express 5، req.query فقط‌خواندنی است
// و نمی‌شود جایگزینش کرد، پس نتیجه‌ی تمیز را در res.locals.query می‌گذاریم.
export const validateQuery =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    res.locals.query = check(schema, req.query);
    next();
  };
