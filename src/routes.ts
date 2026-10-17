import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;
