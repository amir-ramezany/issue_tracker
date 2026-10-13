import { prisma } from "../../config/prisma";

// فقط فیلدهای امن؛ passwordHash عمداً نیست
const publicUserSelect = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function createUser(email: string, passwordHash: string) {
  return prisma.user.create({
    data: { email, passwordHash }, // role پیش‌فرض USER است
    select: publicUserSelect,
  });
}
