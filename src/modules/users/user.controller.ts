import type { Request, Response } from "express";
import * as userService from "./user.service";

export async function getMe(req: Request, res: Response) {
  const user = await userService.getMe(req.user!.id);
  res.status(200).json({ user });
}
export async function updateMe(req: Request, res: Response) {
  const user = await userService.updateMe(req.user!.id, req.body);
  res.status(200).json({ user });
}
