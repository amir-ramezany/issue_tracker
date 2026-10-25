import { Router } from "express";
import { authenticate } from "../../common/middlewares/authenticate.middleware";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../common/middlewares/validate.middleware";
import {
  createIssue,
  deleteIssue,
  getIssue,
  listIssues,
  updateIssue,
} from "./issue.controller";
import {
  createIssueSchema,
  issueParamsSchema,
  listIssuesQuerySchema,
  projectParamsSchema,
  updateIssueSchema,
} from "./issue.schema";

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

router.get(
  "/projects/:projectId/issues",
  authenticate,
  validateParams(projectParamsSchema),
  validateQuery(listIssuesQuerySchema),
  listIssues,
);

router.get(
  "/issues/:issueId",
  authenticate,
  validateParams(issueParamsSchema),
  getIssue,
);

router.patch(
  "/issues/:issueId",
  authenticate,
  validateParams(issueParamsSchema),
  validateBody(updateIssueSchema),
  updateIssue,
);

router.delete(
  "/issues/:issueId",
  authenticate,
  validateParams(issueParamsSchema),
  deleteIssue,
);

export default router;
