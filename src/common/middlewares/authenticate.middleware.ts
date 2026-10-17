import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../errors/appError";
export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new AppError(401, "UNAUTHORIZED", "Missing or invalid token");
  }

  try {
    const payload = jwt.verify(
      header.slice(7),
      env.JWT_SECRET,
    ) as jwt.JwtPayload;
    req.user = { id: Number(payload.sub), role: payload.role };
  } catch {
    throw new AppError(401, "UNAUTHORIZED", "Missing or invalid token");
  }

  next();
};
