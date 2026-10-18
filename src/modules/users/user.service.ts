import { AppError } from "../../common/errors/appError";
import * as userRepository from "./user.repository";
import type { UpdateMeInput } from "./user.schema";
export async function getMe(userId: number) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }
  return user;
}

export async function updateMe(userId: number, input: UpdateMeInput) {
  const email = input.email.toLowerCase();

  const existing = await userRepository.findByEmail(email);
  if (existing && existing.id !== userId) {
    throw new AppError(409, "EMAIL_TAKEN", "Email is already registered");
  }

  return userRepository.updateEmail(userId, email);
}
