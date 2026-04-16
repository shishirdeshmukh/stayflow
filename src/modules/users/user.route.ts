import { Router } from "express";
import * as UserController from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateProfileSchema } from "./user.schema";

const router = Router();

// GET /api/users/me
router.get("/me", authenticate, UserController.getMe);

// PATCH /api/users/me
router.patch("/me", authenticate, validate(updateProfileSchema), UserController.updateMe);

// GET /api/users/:id
router.get("/:id", UserController.getHostProfile);

export default router;
