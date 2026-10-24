import { Router } from "express";
import { authenticate } from "../../common/middlewares/authenticate.middleware";
import {
  validateBody,
  validateParams,
} from "../../common/middlewares/validate.middleware";
import { createComment, deleteComment, listComments, updateComment } from "./comment.controller";
import { commentBodySchema, commentParamsSchema, issueParamsSchema } from "./comment.schema";

const router = Router();

// مثل issue.routes: به ریشه وصل می‌شود، پس authenticate روی هر route جدا می‌آید
router.post(
  "/issues/:issueId/comments",
  authenticate,
  validateParams(issueParamsSchema),
  validateBody(commentBodySchema),
  createComment,
);

router.get(
  "/issues/:issueId/comments",
  authenticate,
  validateParams(issueParamsSchema),
  listComments,
);

router.patch(
  "/comments/:commentId",
  authenticate,
  validateParams(commentParamsSchema),
  validateBody(commentBodySchema),
  updateComment,
);

router.delete(
  "/comments/:commentId",
  authenticate,
  validateParams(commentParamsSchema),
  deleteComment,
);

export default router;
