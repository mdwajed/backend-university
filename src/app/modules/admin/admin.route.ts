import { Router } from "express";
import validateRequest from "../../../middlewares/validateRequest.js";
import { AdminController } from "./admin.controller.js";
import { adminZodValidations } from "./admin.validation.js";

const router = Router();

router.get("/", AdminController.getAllAdmin);
router.get("/:id", AdminController.getAdminById);
router.patch(
  "/:id",
  validateRequest(adminZodValidations.updateAdminZodSchema),
  AdminController.updateAdmin
);
router.delete("/:id", AdminController.deleteAdmin);
export const AdminRoutes = router;
