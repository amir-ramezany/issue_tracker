import { prisma } from "../../config/prisma";

const projectSelect = {
  id: true,
  name: true,
  key: true,
  description: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function findByKey(key: string) {
  return prisma.project.findUnique({ where: { key }, select: { id: true } });
}

// پروژه و عضویت OWNER سازنده، با هم و در یک تراکنش
export function create(
  data: { name: string; key: string; description?: string },
  ownerId: number,
) {
  return prisma.project.create({
    data: {
      ...data,
      ownerId,
      members: { create: { userId: ownerId, role: "OWNER" } },
    },
    select: projectSelect,
  });
}
