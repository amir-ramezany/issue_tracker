import { AppError } from "../../common/errors/appError";
import { AuthUser } from "../../common/types/authUser";
import * as projectRepository from "./project.repository";
import type { CreateProjectInput, UpdateProjectInput } from "./project.schema";
import * as userService from "../users/user.service";

export async function createProject(
  input: CreateProjectInput,
  actor: AuthUser,
) {
  const existing = await projectRepository.findByKey(input.key);
  if (existing) {
    throw new AppError(
      409,
      "PROJECT_KEY_TAKEN",
      "Project key is already in use",
    );
  }

  return projectRepository.create(input, actor.id);
}

export function listProjects(actor: AuthUser) {
  return projectRepository.findMany(
    actor.role === "ADMIN" ? undefined : actor.id,
  );
}

// پروژه را برمی‌گرداند، به شرط اینکه actor عضو یا ادمین باشد.
// برای غیرعضو ۴۰۴ می‌دهیم تا وجود پروژه لو نرود.
async function getProjectForActor(projectId: number, actor: AuthUser) {
  const project = await projectRepository.findById(projectId);
  const isMember = project?.members.some((m) => m.user.id === actor.id);

  if (!project || (!isMember && actor.role !== "ADMIN")) {
    throw new AppError(404, "PROJECT_NOT_FOUND", "Project not found");
  }

  return project;
}

export function getProject(projectId: number, actor: AuthUser) {
  return getProjectForActor(projectId, actor);
}

// فقط owner پروژه یا ادمین. عضو معمولی ۴۰۳ می‌گیرد چون پروژه را می‌بیند
function assertCanManage(project: { ownerId: number }, actor: AuthUser) {
  if (project.ownerId !== actor.id && actor.role !== "ADMIN") {
    throw new AppError(403, "FORBIDDEN", "Only the project owner can do this");
  }
}

export async function updateProject(
  projectId: number,
  input: UpdateProjectInput,
  actor: AuthUser,
) {
  const project = await getProjectForActor(projectId, actor);
  assertCanManage(project, actor);
  return projectRepository.update(projectId, input);
}

export async function deleteProject(projectId: number, actor: AuthUser) {
  const project = await getProjectForActor(projectId, actor);
  assertCanManage(project, actor);
  await projectRepository.remove(projectId);
}

export async function addMember(
  projectId: number,
  userId: number,
  actor: AuthUser,
) {
  const project = await getProjectForActor(projectId, actor);
  assertCanManage(project, actor);

  if (project.members.some((m) => m.user.id === userId)) {
    throw new AppError(
      409,
      "ALREADY_MEMBER",
      "User is already a member of this project",
    );
  }

  await userService.getUserById(userId); // اگر کاربر وجود نداشته باشد ۴۰۴

  return projectRepository.addMember(projectId, userId);
}

export async function removeMember(
  projectId: number,
  userId: number,
  actor: AuthUser,
) {
  const project = await getProjectForActor(projectId, actor);
  assertCanManage(project, actor);

  if (userId === project.ownerId) {
    throw new AppError(
      400,
      "OWNER_CANNOT_BE_REMOVED",
      "The project owner cannot be removed",
    );
  }

  if (!project.members.some((m) => m.user.id === userId)) {
    throw new AppError(
      404,
      "MEMBER_NOT_FOUND",
      "User is not a member of this project",
    );
  }

  await projectRepository.removeMember(projectId, userId);
}
