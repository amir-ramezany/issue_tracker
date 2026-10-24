import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/appError";
import { Prisma } from "../../generated/prisma/client";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json({ error: { code: err.code, message: err.message } });
    return;
  }

  if (err?.type === "entity.parse.failed") {
    res.status(400).json({
      error: { code: "INVALID_JSON", message: "Malformed JSON body" },
    });
    return;
  }

  if (err?.type === "entity.too.large") {
    res.status(413).json({
      error: {
        code: "PAYLOAD_TOO_LARGE",
        message: "Request body is too large",
      },
    });
    return;
  }

  // خطاهای شناخته‌شده‌ی دیتابیس را بدون جزئیات داخلی به کلاینت می‌دهیم
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res
        .status(409)
        .json({
          error: { code: "CONFLICT", message: "Resource already exists" },
        });
      return;
    }
    if (err.code === "P2003") {
      res
        .status(409)
        .json({
          error: {
            code: "CONFLICT",
            message: "Operation conflicts with related data",
          },
        });
      return;
    }
    if (err.code === "P2025") {
      res
        .status(404)
        .json({ error: { code: "NOT_FOUND", message: "Resource not found" } });
      return;
    }
  }

  console.error(err);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
  });
};
