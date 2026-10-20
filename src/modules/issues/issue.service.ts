import { AppError } from "../../common/errors/appError";
import { AuthUser } from "../../common/types/authUser";
import * as projectService from "../projects/project.service";
import * as issueRepository from "./issue.repository";
import type { CreateIssueInput } from "./issue.schema";

export async function createIssue(
  projectId: number,
  input: CreateIssueInput,
  actor: AuthUser,
) {
  await projectService.getProjectForActor(projectId, actor); // عضو یا ادمین؟
  return issueRepository.create(projectId, actor.id, input); // reporter همان کاربر لاگین‌شده
}

export async function listIssues(projectId: number, actor: AuthUser) {
  await projectService.getProjectForActor(projectId, actor);
  return issueRepository.findManyByProject(projectId);
}

// issue و پروژه‌اش را برمی‌گرداند، به شرطی که actor به آن پروژه دسترسی داشته باشد.
// issue ناموجود و issue پروژه‌ی دیگران هر دو همان ۴۰۴ را می‌دهند.
async function getIssueForActor(issueId: number, actor: AuthUser) {
  const issue = await issueRepository.findById(issueId);
  const project = issue && (await projectService.findProjectForActor(issue.projectId, actor));

  if (!issue || !project) {
    throw new AppError(404, "ISSUE_NOT_FOUND", "Issue not found");
  }

  return { issue, project };
}

export async function getIssue(issueId: number, actor: AuthUser) {
  const { issue } = await getIssueForActor(issueId, actor);
  return issue;
}




