import { Router } from "express";
import { authenticate } from "../../common/middlewares/authenticate.middleware";
import { getMe, updateMe } from "./user.controller";
import { updateMeSchema } from "./user.schema";
import { validateBody } from "../../common/middlewares/validate.middleware";

const router = Router();

router.get("/me", authenticate, getMe);
router.patch("/me", authenticate, validateBody(updateMeSchema), updateMe);

export default router;
