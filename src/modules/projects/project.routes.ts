import { Router } from "express";
import { authenticate } from "../../common/middlewares/authenticate.middleware";
import {
  validateBody,
  validateParams,
} from "../../common/middlewares/validate.middleware";
import { createProject, getProject, listProjects } from "./project.controller";
import { createProjectSchema, projectIdParamsSchema } from "./project.schema";

const router = Router();

router.use(authenticate); // همه‌ی مسیرهای پروژه نیاز به لاگین دارند

router.get("/", listProjects);
router.get("/:projectId", validateParams(projectIdParamsSchema), getProject);
router.post("/", validateBody(createProjectSchema), createProject);

export default router;
