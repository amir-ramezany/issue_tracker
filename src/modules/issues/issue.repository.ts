import { prisma } from "../../config/prisma";
import { Prisma } from "../../generated/prisma/client";
import type {
  CreateIssueInput,
  ListIssuesQuery,
  UpdateIssueInput,
} from "./issue.schema";

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

export async function findManyByProject(
  projectId: number,
  query: ListIssuesQuery,
) {
  // مقدار undefined در where نادیده گرفته می‌شود، پس فیلترهای نفرستاده اثری ندارند
  const where: Prisma.IssueWhereInput = {
    projectId,
    status: query.status,
    priority: query.priority,
    assigneeId: query.assigneeId,
    reporterId: query.reporterId,
    ...(query.search && {
      OR: [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ],
    }),
  };

  // sortBy قبلاً با Zod به لیست مجاز محدود شده، پس cast امن است.
  // id به‌عنوان معیار دوم، ترتیب را بین صفحه‌ها پایدار نگه می‌دارد.
  const orderBy = [
    { [query.sortBy]: query.order },
    { id: query.order },
  ] as Prisma.IssueOrderByWithRelationInput[];

  // دو کوئری در یک تراکنش: صفحه‌ی فعلی و تعداد کل
  const [issues, totalItems] = await prisma.$transaction([
    prisma.issue.findMany({
      where,
      select: issueSelect,
      orderBy,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.issue.count({ where }),
  ]);

  //we can use this promis.all instead of transaction here cause we just read from database and not write anything ,, promis.all doing two queries at the same time on two threads usually
  // const [issues, totalItems] = await Promise.all([
  //   prisma.issue.findMany({ where, select: issueSelect, orderBy, skip: (query.page - 1) * query.limit, take: query.limit }),
  //   prisma.issue.count({ where }),
  // ]);

  return { issues, totalItems };
}

export function findById(id: number) {
  return prisma.issue.findUnique({ where: { id }, select: issueSelect });
}

export function update(id: number, data: UpdateIssueInput) {
  return prisma.issue.update({ where: { id }, data, select: issueSelect });
}

export function remove(id: number) {
  return prisma.issue.delete({ where: { id } });
}
