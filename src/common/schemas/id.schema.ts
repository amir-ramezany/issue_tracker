import { z } from "zod";

// بزرگ‌ترین مقدار Int در PostgreSQL
const MAX_INT = 2147483647;

// برای پارامترهای URL (رشته است، coerce آن را به عدد تبدیل می‌کند)
export const idSchema = z.coerce.number().int().positive().max(MAX_INT);

// برای بدنه‌ی JSON (از قبل عدد است)
export const jsonIdSchema = z.number().int().positive().max(MAX_INT);
