import type { Request, Response } from "express";
import * as commentService from "./comment.service";

export async function createComment(req: Request, res: Response) {
  const comment = await commentService.createComment(
    Number(req.params.issueId),
    req.body,
    req.user!,
  );
  res.status(201).json({ comment });
}

export async function listComments(req: Request, res: Response) {
  const comments = await commentService.listComments(
    Number(req.params.issueId),
    req.user!,
  );
  res.status(200).json({ comments });
}

export async function updateComment(req: Request, res: Response) {
  const comment = await commentService.updateComment(
    Number(req.params.commentId),
    req.body,
    req.user!,
  );
  res.status(200).json({ comment });
}

export async function deleteComment(req: Request, res: Response) {
  await commentService.deleteComment(Number(req.params.commentId), req.user!);
  res.status(204).send();
}
