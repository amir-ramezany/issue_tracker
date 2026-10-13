import type { Request, Response } from "express";
import * as authService from "./auth.service";

export async function register(req: Request, res: Response) {
  const user = await authService.register(req.body);
  res.status(201).json({ user });
}
