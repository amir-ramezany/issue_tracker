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

export function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email }, select: publicUserSelect });
}

export function updateEmail(id: number, email: string) {
  return prisma.user.update({
    where: { id },
    data: { email },
    select: publicUserSelect,
  });
}
