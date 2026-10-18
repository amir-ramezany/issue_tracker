import type { Request, Response } from "express";
import * as projectService from "./project.service";

export async function createProject(req: Request, res: Response) {
  const project = await projectService.createProject(req.body, req.user!);
  res.status(201).json({ project });
}
