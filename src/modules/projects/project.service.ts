import { AppError } from "../../common/errors/appError";
import { AuthUser } from "../../common/types/authUser";
import * as projectRepository from "./project.repository";
import type { CreateProjectInput } from "./project.schema";

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
