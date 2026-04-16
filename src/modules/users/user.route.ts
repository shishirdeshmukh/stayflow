import { Router } from "express";
import * as UserController from "./user.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateProfileSchema } from "./user.schema";

const router = Router();

// GET /api/users/me — login hona chahiye
router.get("/me", authenticate, UserController.getMe);

// PATCH /api/users/me — login hona chahiye + validate
router.patch("/me", authenticate, validate(updateProfileSchema), UserController.updateMe);

// GET /api/users/:id — public route — koi bhi host profile dekh sakta hai
router.get("/:id", UserController.getHostProfile);

export default router;
