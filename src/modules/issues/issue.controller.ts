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
