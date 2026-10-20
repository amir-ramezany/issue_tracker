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
