import type { Request, Response } from "express";
import * as issueService from "./issue.service";

export async function createIssue(req: Request, res: Response) {
  const issue = await issueService.createIssue(
    Number(req.params.projectId),
    req.body,
    req.user!,
  );
  res.status(201).json({ issue });
}
export async function listIssues(req: Request, res: Response) {
  const issues = await issueService.listIssues(
    Number(req.params.projectId),
    req.user!,
  );
  res.status(200).json({ issues });
}

export async function getIssue(req: Request, res: Response) {
  const issue = await issueService.getIssue(
    Number(req.params.issueId),
    req.user!,
  );
  res.status(200).json({ issue });
}

export async function updateIssue(req: Request, res: Response) {
  const issue = await issueService.updateIssue(
    Number(req.params.issueId),
    req.body,
    req.user!,
  );
  res.status(200).json({ issue });
}

export async function deleteIssue(req: Request, res: Response) {
  await issueService.deleteIssue(Number(req.params.issueId), req.user!);
  res.status(204).send();
}
