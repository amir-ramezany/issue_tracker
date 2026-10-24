import { AuthUser } from "../../common/types/authUser";
import * as issueService from "../issues/issue.service";
import * as commentRepository from "./comment.repository";
import type { CommentBodyInput } from "./comment.schema";

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
