import express, { NextFunction, Request, Response } from "express";
import auth from "../../../middlewares/auth.js";
import validateRequest from "../../../middlewares/validateRequest.js";
import { upload } from "../../utils/uploadImgToCloudinary.js";
import { adminZodValidations } from "../admin/admin.validation.js";
import { FacultyZodValidation } from "../faculty/faculty.validation.js";
import { studentZodValidations } from "../student/student.validation.js";
import { UserController } from "./user.controller.js";
import { UserValidations } from "./user.validation.js";
const router = express.Router();

router.post(
  "/create-student",
  auth("admin"),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
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
  auth("admin"),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(FacultyZodValidation.createFacultyZodSchema),
  UserController.createFaculty
);
router.post(
  "/change-status/:id",
  auth("admin"),
  validateRequest(UserValidations.UserStatusValidationSchema),
  UserController.changeUserStatus
);

router.get("/me", auth("student", "admin", "faculty"), UserController.getMe);

export const UserRoutes = router;
