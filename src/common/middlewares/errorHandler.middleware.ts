import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/appError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .json({ error: { code: err.code, message: err.message } });
    return;
  }

  if (err?.type === "entity.parse.failed") {
    res
      .status(400)
      .json({
        error: { code: "INVALID_JSON", message: "Malformed JSON body" },
      });
    return;
  }

  console.error(err);
  res
    .status(500)
    .json({
      error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
    });
};
