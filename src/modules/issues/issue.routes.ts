import { Router } from "express";
import { authenticate } from "../../common/middlewares/authenticate.middleware";
import {
  validateBody,
  validateParams,
} from "../../common/middlewares/validate.middleware";
import { createIssue } from "./issue.controller";
import { createIssueSchema, projectParamsSchema } from "./issue.schema";

const router = Router();

// مسیرهای این router هم زیر /projects و هم زیر /issues هستند، پس router به ریشه وصل می‌شود.
// به همین دلیل authenticate را برای هر مسیر جداگانه می‌گذاریم، نه با router.use
router.post(
  "/projects/:projectId/issues",
  authenticate,
  validateParams(projectParamsSchema),
  validateBody(createIssueSchema),
  createIssue,
);

export default router;
