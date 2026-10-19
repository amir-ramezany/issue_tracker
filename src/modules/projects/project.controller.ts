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

export async function updateProject(req: Request, res: Response) {
  const project = await projectService.updateProject(
    Number(req.params.projectId),
    req.body,
    req.user!,
  );
  res.status(200).json({ project });
}

export async function deleteProject(req: Request, res: Response) {
  await projectService.deleteProject(Number(req.params.projectId), req.user!);
  res.status(204).send();
}

export async function addMember(req: Request, res: Response) {
  const member = await projectService.addMember(
    Number(req.params.projectId),
    req.body.userId,
    req.user!,
  );
  res.status(201).json({ member });
}

export async function removeMember(req: Request, res: Response) {
  await projectService.removeMember(
    Number(req.params.projectId),
    Number(req.params.userId),
    req.user!,
  );
  res.status(204).send();
}
