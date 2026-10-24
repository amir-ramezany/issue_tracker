import { prisma } from "../../config/prisma";

const commentSelect = {
  id: true,
  issueId: true,
  authorId: true,
  body: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function create(issueId: number, authorId: number, body: string) {
  return prisma.comment.create({
    data: { issueId, authorId, body },
    select: commentSelect,
  });
}

// قدیمی‌ترین اول؛ id خودکار زیاد می‌شود، پس ترتیب پایدار است
export function findManyByIssue(issueId: number) {
  return prisma.comment.findMany({
    where: { issueId },
    select: commentSelect,
    orderBy: { id: "asc" },
  });
}

export function findById(id: number) {
  return prisma.comment.findUnique({ where: { id }, select: commentSelect });
}

export function updateBody(id: number, body: string) {
  return prisma.comment.update({
    where: { id },
    data: { body },
    select: commentSelect,
  });
}

export function remove(id: number) {
  return prisma.comment.delete({ where: { id } });
}
