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
