import bcrypt from "bcrypt";
import * as authRepository from "./auth.repository";
import { AppError } from "../../common/errors/appError";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import type { LoginInput, RegisterInput } from "./auth.schema";

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

export async function login(input: LoginInput) {
  const user = await authRepository.findByEmail(input.email.toLowerCase());
  const passwordOk =
    user && (await bcrypt.compare(input.password, user.passwordHash));

  // یک پیام برای هر دو حالت، تا معلوم نشود ایمیل وجود دارد یا نه
  if (!user || !passwordOk) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const accessToken = jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: String(user.id),
    expiresIn: "1h",
  });

  const { passwordHash, ...safeUser } = user;
  return { accessToken, user: safeUser };
}
