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
