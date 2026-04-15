import { Router } from "express";
import * as AuthController from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "./auth.schema";

const router = Router();

// POST /api/auth/register
router.post(
  "/register",
  validate(registerSchema),
  AuthController.register
);

// POST /api/auth/login
router.post(
  "/login",
  validate(loginSchema),
  AuthController.login
);

// POST /api/auth/logout
router.post("/logout", AuthController.logout);

// POST /api/auth/refresh-token
router.post("/refresh-token", AuthController.refreshToken);

export default router;