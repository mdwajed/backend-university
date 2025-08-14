import { Router } from "express";
import auth from "../../../middlewares/auth.js";
import validateRequest from "../../../middlewares/validateRequest.js";
import { USER_ROLE } from "../auth/auth.const.js";
import { FacultyController } from "./faculty.controller.js";
import { FacultyZodValidation } from "./faculty.validation.js";

const router = Router();
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  FacultyController.getAllFaculty
);
router.get("/:id", FacultyController.getFacultyById);
router.patch(
  "/:id",
  validateRequest(FacultyZodValidation.updateFacultyZodSchema),
  FacultyController.updateFaculty
);
router.delete("/:id", FacultyController.deleteFaculty);

export const FacultyRoutes = router;
