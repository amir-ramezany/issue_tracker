import type { RequestHandler } from "express";
import { AppError } from "../errors/appError";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  throw new AppError(
    404,
    "NOT_FOUND",
    `Route ${req.method} ${req.originalUrl} not found`,
  );
};
