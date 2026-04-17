import { Router } from "express";
import * as PropertyController from "./property.controller";
import { authenticate, authorize } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createPropertySchema, updatePropertySchema } from "./property.schema";

const router = Router();

// GET /api/properties — public
router.get("/", PropertyController.getProperties);

// POST /api/properties — only HOST & ADMIN
router.post(
    "/",
    authenticate,
    authorize("HOST", "ADMIN"),
    validate(createPropertySchema),
    PropertyController.createProperty
);

// GET /api/properties/:id — public
router.get("/:id", PropertyController.getPropertyById);

// PATCH /api/properties/:id — only HOST & ADMIN
router.patch(
    "/:id",
    authenticate,
    authorize("HOST", "ADMIN"),
    validate(updatePropertySchema),
    PropertyController.updateProperty
);

// DELETE /api/properties/:id — only HOST & ADMIN
router.delete("/:id", authenticate, authorize("HOST", "ADMIN"), PropertyController.deleteProperty);

export default router;
