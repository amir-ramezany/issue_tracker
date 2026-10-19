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

const memberSelect = {
  role: true,
  createdAt: true,
  user: { select: { id: true, email: true } },
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

// بدون userId همه‌ی پروژه‌ها (برای ادمین)، با userId فقط پروژه‌هایی که او عضوشان است
export function findMany(onlyForUserId?: number) {
  return prisma.project.findMany({
    where: onlyForUserId
      ? { members: { some: { userId: onlyForUserId } } }
      : undefined,
    select: projectSelect,
    orderBy: { createdAt: "desc" },
  });
}

// پروژه با لیست اعضا: هم برای نمایش، هم برای بررسی دسترسی
export function findById(id: number) {
  return prisma.project.findUnique({
    where: { id },
    select: { ...projectSelect, members: { select: memberSelect } },
  });
}

export function update(
  id: number,
  data: { name?: string; description?: string },
) {
  return prisma.project.update({ where: { id }, data, select: projectSelect });
}

// اعضا، issueها و commentهای پروژه هم با Cascade پاک می‌شوند
export function remove(id: number) {
  return prisma.project.delete({ where: { id } });
}

export function addMember(projectId: number, userId: number) {
  return prisma.projectMember.create({
    data: { projectId, userId }, // role پیش‌فرض MEMBER است
    select: memberSelect,
  });
}

export function removeMember(projectId: number, userId: number) {
  return prisma.projectMember.delete({
    where: { projectId_userId: { projectId, userId } },
  });
}
