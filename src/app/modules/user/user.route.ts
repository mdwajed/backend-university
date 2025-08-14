import express from "express";
import auth from "../../../middlewares/auth.js";
import validateRequest from "../../../middlewares/validateRequest.js";
import { adminZodValidations } from "../admin/admin.validation.js";
import { USER_ROLE } from "../auth/auth.const.js";
import { FacultyZodValidation } from "../faculty/faculty.validation.js";
import { studentZodValidations } from "../student/student.validation.js";
import { UserController } from "./user.controller.js";
const router = express.Router();

router.post(
  "/create-student",
  auth(USER_ROLE.admin),
  validateRequest(studentZodValidations.createStudentZodSchema),
  UserController.createStudent
);
router.post(
  "/create-admin",
  validateRequest(adminZodValidations.createAdminZodSchema),
  UserController.createAdmin
);
router.post(
  "/create-faculty",
  validateRequest(FacultyZodValidation.createFacultyZodSchema),
  UserController.createFaculty
);

export const UserRoutes = router;
