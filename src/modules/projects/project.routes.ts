import { Router } from "express";
import { authenticate } from "../../common/middlewares/authenticate.middleware";
import { validateBody } from "../../common/middlewares/validate.middleware";
import { createProject } from "./project.controller";
import { createProjectSchema } from "./project.schema";

const router = Router();

router.use(authenticate); // همه‌ی مسیرهای پروژه نیاز به لاگین دارند

router.post("/", validateBody(createProjectSchema), createProject);

export default router;
