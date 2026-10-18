import type { Request, Response } from "express";
import * as projectService from "./project.service";

export async function createProject(req: Request, res: Response) {
  const project = await projectService.createProject(req.body, req.user!);
  res.status(201).json({ project });
}

export async function listProjects(req: Request, res: Response) {
  const projects = await projectService.listProjects(req.user!);
  res.status(200).json({ projects });
}

export async function getProject(req: Request, res: Response) {
  const project = await projectService.getProject(
    Number(req.params.projectId),
    req.user!,
  );
  res.status(200).json({ project });
}
