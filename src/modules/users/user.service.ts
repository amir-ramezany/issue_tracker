import { AppError } from "../../common/errors/appError";
import * as userRepository from "./user.repository";

export async function getMe(userId: number) {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError(404, "USER_NOT_FOUND", "User not found");
  }
  return user;
}
