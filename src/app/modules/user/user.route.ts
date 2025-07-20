import express from "express";
import validateRequest from "../../../middlewares/validateRequest.js";
import { studentZodValidations } from "../student/student.validation.js";
import { UserController } from "./user.controller.js";
const router = express.Router();

router.post(
  "/create-student",
  validateRequest(studentZodValidations.createStudentZodSchema),
  UserController.createStudent
);

export const UserRoutes = router;
