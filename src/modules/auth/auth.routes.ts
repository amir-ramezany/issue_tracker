import { Router } from "express";
import { validateBody } from "../../common/middlewares/validate.middleware";
import { register } from "./auth.controller";
import { registerSchema } from "./auth.schema";

const router = Router();

router.post("/register", validateBody(registerSchema), register);

export default router;
