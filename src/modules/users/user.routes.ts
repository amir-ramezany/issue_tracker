import { Router } from "express";
import { authenticate } from "../../common/middlewares/authenticate.middleware";
import { getMe } from "./user.controller";

const router = Router();

router.get("/me", authenticate, getMe);

export default router;
