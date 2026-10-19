import { Router } from "express";
import { authenticate } from "../../common/middlewares/authenticate.middleware";
import {
  validateBody,
  validateParams,
} from "../../common/middlewares/validate.middleware";
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from "./project.controller";
import {
  createProjectSchema,
  projectIdParamsSchema,
  updateProjectSchema,
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

export default router;
