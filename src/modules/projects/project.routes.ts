import { Router } from "express";
import { authenticate } from "../../common/middlewares/authenticate.middleware";
import {
  validateBody,
  validateParams,
} from "../../common/middlewares/validate.middleware";
import {
  addMember,
  createProject,
  deleteProject,
  getProject,
  listProjects,
  removeMember,
  updateProject,
} from "./project.controller";
import {
  createProjectSchema,
  memberParamsSchema,
  projectIdParamsSchema,
  updateProjectSchema,
  addMemberSchema,
} from "./project.schema";

const router = Router();

router.use(authenticate); // همه‌ی مسیرهای پروژه نیاز به لاگین دارند

router.get("/", listProjects);
router.get("/:projectId", validateParams(projectIdParamsSchema), getProject);
router.post("/", validateBody(createProjectSchema), createProject);
router.patch(
  "/:projectId",
  validateParams(projectIdParamsSchema),
  validateBody(updateProjectSchema),
  updateProject,
);
router.delete(
  "/:projectId",
  validateParams(projectIdParamsSchema),
  deleteProject,
);

router.post(
  "/:projectId/members",
  validateParams(projectIdParamsSchema),
  validateBody(addMemberSchema),
  addMember,
);
router.delete(
  "/:projectId/members/:userId",
  validateParams(memberParamsSchema),
  removeMember,
);

export default router;
