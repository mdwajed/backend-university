import express from "express";
import auth from "../../../middlewares/auth.js";
import stripSensitiveFields from "../../../middlewares/stripSensitiveFields.js";
import validateRequest from "../../../middlewares/validateRequest.js";

import { StudentController } from "./student.controller.js";
import { studentZodValidations } from "./student.validation.js";
const router = express.Router();

router.get("/", auth("admin", "faculty"), StudentController.getAllStudents);
router.get("/:id", auth("admin", "faculty"), StudentController.getStudentById);
router.patch(
  "/:id",
  stripSensitiveFields(["id", "email", "user"]),
  validateRequest(studentZodValidations.updateStudentZodSchema),
  StudentController.updateStudent
);
router.delete("/:id", StudentController.deleteStudent);

export const StudentRoutes = router;
