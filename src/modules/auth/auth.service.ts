import bcrypt from "bcrypt";
import * as authRepository from "./auth.repository";
import type { RegisterInput } from "./auth.schema";
import { AppError } from "../../common/errors/appError";

const SALT_ROUNDS = 10;

export async function register(input: RegisterInput) {
  const email = input.email.toLowerCase();

  const existing = await authRepository.findByEmail(email);
  if (existing) {
    throw new AppError(409, "EMAIL_TAKEN", "Email is already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  return authRepository.createUser(email, passwordHash);
}
