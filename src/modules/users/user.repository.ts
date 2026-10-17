import { prisma } from "../../config/prisma";

const publicUserSelect = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function findById(id: number) {
  return prisma.user.findUnique({ where: { id }, select: publicUserSelect });
}
