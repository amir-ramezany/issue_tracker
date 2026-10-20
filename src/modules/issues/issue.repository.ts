import { prisma } from "../../config/prisma";
import type { CreateIssueInput } from "./issue.schema";

const issueSelect = {
  id: true,
  projectId: true,
  number: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  reporterId: true,
  assigneeId: true,
  createdAt: true,
  updatedAt: true,
} as const;

// شماره‌ی بعدیِ همان پروژه را حساب می‌کند و issue را در یک تراکنش می‌سازد
export function create(
  projectId: number,
  reporterId: number,
  data: CreateIssueInput,
) {
  return prisma.$transaction(async (tx) => {
    const last = await tx.issue.aggregate({
      where: { projectId },
      _max: { number: true },
    });
    const number = (last._max.number ?? 0) + 1;

    return tx.issue.create({
      data: { ...data, projectId, number, reporterId },
      select: issueSelect,
    });
  });
}

export function findManyByProject(projectId: number) {
  return prisma.issue.findMany({
    where: { projectId },
    select: issueSelect,
    orderBy: { number: "desc" },
  });
}

export function findById(id: number) {
  return prisma.issue.findUnique({ where: { id }, select: issueSelect });
}
