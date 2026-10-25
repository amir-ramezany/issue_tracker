import { AppError } from "../../common/errors/appError";
import { AuthUser } from "../../common/types/authUser";
import * as projectService from "../projects/project.service";
import * as issueRepository from "./issue.repository";
import type {
  CreateIssueInput,
  ListIssuesQuery,
  UpdateIssueInput,
} from "./issue.schema";

export async function createIssue(
  projectId: number,
  input: CreateIssueInput,
  actor: AuthUser,
) {
  await projectService.getProjectForActor(projectId, actor); // عضو یا ادمین؟
  return issueRepository.create(projectId, actor.id, input); // reporter همان کاربر لاگین‌شده
}

export async function listIssues(
  projectId: number,
  query: ListIssuesQuery,
  actor: AuthUser,
) {
  await projectService.getProjectForActor(projectId, actor);

  const { issues, totalItems } = await issueRepository.findManyByProject(
    projectId,
    query,
  );

  return {
    issues,
    pagination: {
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages: Math.ceil(totalItems / query.limit),
    },
  };
}

// issue و پروژه‌اش را برمی‌گرداند، به شرطی که actor به آن پروژه دسترسی داشته باشد.
// issue ناموجود و issue پروژه‌ی دیگران هر دو همان ۴۰۴ را می‌دهند.
export async function getIssueForActor(issueId: number, actor: AuthUser) {
  const issue = await issueRepository.findById(issueId);
  const project =
    issue && (await projectService.findProjectForActor(issue.projectId, actor));

  if (!issue || !project) {
    throw new AppError(404, "ISSUE_NOT_FOUND", "Issue not found");
  }

  return { issue, project };
}

// issue و پروژه‌اش را برمی‌گرداند اگر actor به آن پروژه دسترسی داشته باشد، وگرنه null
// export async function findIssueForActor(issueId: number, actor: AuthUser) {
//   const issue = await issueRepository.findById(issueId);
//   if (!issue) return null;

//   const project = await projectService.findProjectForActor(
//     issue.projectId,
//     actor,
//   );
//   if (!project) return null;

//   return { issue, project };
// }

// // همان، ولی به‌جای null خطای ۴۰۴ می‌دهد. issue ناموجود و issue پروژه‌ی دیگران یک پیام دارند.
// export async function getIssueForActor(issueId: number, actor: AuthUser) {
//   const result = await findIssueForActor(issueId, actor);
//   if (!result) {
//     throw new AppError(404, "ISSUE_NOT_FOUND", "Issue not found");
//   }
//   return result;
// }

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
