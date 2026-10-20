import { AppError } from "../../common/errors/appError";
import { AuthUser } from "../../common/types/authUser";
import * as projectService from "../projects/project.service";
import * as issueRepository from "./issue.repository";
import type { CreateIssueInput, UpdateIssueInput } from "./issue.schema";

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
  const project =
    issue && (await projectService.findProjectForActor(issue.projectId, actor));

  if (!issue || !project) {
    throw new AppError(404, "ISSUE_NOT_FOUND", "Issue not found");
  }

  return { issue, project };
}

export async function getIssue(issueId: number, actor: AuthUser) {
  const { issue } = await getIssueForActor(issueId, actor);
  return issue;
}

export async function updateIssue(
  issueId: number,
  input: UpdateIssueInput,
  actor: AuthUser,
) {
  const { issue, project } = await getIssueForActor(issueId, actor);
  const isManager = projectService.canManageProject(project, actor);

  // ویرایش: reporter، assignee، owner پروژه یا ادمین
  const canEdit =
    isManager || issue.reporterId === actor.id || issue.assigneeId === actor.id;
  if (!canEdit) {
    throw new AppError(403, "FORBIDDEN", "You cannot edit this issue");
  }

  // assign کردن: فقط owner یا ادمین، و فقط به عضو همان پروژه
  if (input.assigneeId !== undefined) {
    if (!isManager) {
      throw new AppError(
        403,
        "FORBIDDEN",
        "Only the project owner can assign issues",
      );
    }

    const isMember = project.members.some(
      (m) => m.user.id === input.assigneeId,
    );
    if (input.assigneeId !== null && !isMember) {
      throw new AppError(
        400,
        "ASSIGNEE_NOT_MEMBER",
        "Assignee must be a member of the project",
      );
    }
  }

  return issueRepository.update(issueId, input);
}

export async function deleteIssue(issueId: number, actor: AuthUser) {
  const { project } = await getIssueForActor(issueId, actor);

  if (!projectService.canManageProject(project, actor)) {
    throw new AppError(
      403,
      "FORBIDDEN",
      "Only the project owner can delete issues",
    );
  }

  await issueRepository.remove(issueId);
}
