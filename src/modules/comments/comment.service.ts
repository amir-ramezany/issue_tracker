import { AppError } from "../../common/errors/appError";
import { AuthUser } from "../../common/types/authUser";
import * as issueService from "../issues/issue.service";
import * as commentRepository from "./comment.repository";
import type { CommentBodyInput } from "./comment.schema";
import * as projectService from "../projects/project.service";

export async function createComment(
  issueId: number,
  input: CommentBodyInput,
  actor: AuthUser,
) {
  await issueService.getIssueForActor(issueId, actor); // عضو، owner یا ادمین؟
  return commentRepository.create(issueId, actor.id, input.body); // نویسنده همان کاربر لاگین‌شده
}

export async function listComments(issueId: number, actor: AuthUser) {
  await issueService.getIssueForActor(issueId, actor);
  return commentRepository.findManyByIssue(issueId);
}

// کامنتی را برمی‌گرداند که actor حق تغییرش را دارد: نویسنده، owner پروژه یا ادمین.
// غیرعضو ۴۰۴ می‌گیرد (وجود کامنت لو نرود)، عضوی که حق ندارد ۴۰۳.
async function getCommentForModify(commentId: number, actor: AuthUser) {
  const comment = await commentRepository.findById(commentId);
  const access =
    comment && (await issueService.getIssueForActor(comment.issueId, actor));

  if (!comment || !access) {
    throw new AppError(404, "COMMENT_NOT_FOUND", "Comment not found");
  }

  const canModify =
    comment.authorId === actor.id ||
    projectService.canManageProject(access.project, actor);
  if (!canModify) {
    throw new AppError(403, "FORBIDDEN", "You cannot modify this comment");
  }

  return comment;
}

export async function updateComment(
  commentId: number,
  input: CommentBodyInput,
  actor: AuthUser,
) {
  const comment = await getCommentForModify(commentId, actor);
  return commentRepository.updateBody(comment.id, input.body);
}

export async function deleteComment(commentId: number, actor: AuthUser) {
  const comment = await getCommentForModify(commentId, actor);
  await commentRepository.remove(comment.id);
}
